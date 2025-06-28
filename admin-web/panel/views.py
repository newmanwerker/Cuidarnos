from django.shortcuts import render, redirect
import psycopg2
import bcrypt
from django.views.decorators.csrf import csrf_exempt
import os
from dotenv import load_dotenv
from .models import Sucursal, AdmUser, Rol, FichaPaciente, Paciente, Medico, Insumo
import json
from django.http import JsonResponse
from django.utils import timezone

def login_admin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        print("📩 Email recibido:", email)
        print("🔒 Password recibido:", password)

        load_dotenv()

        try:
            conn = psycopg2.connect(
                dbname=os.getenv("PG_DBNAME"),
                user=os.getenv("PG_USER"),
                password=os.getenv("PG_PASSWORD"),
                host=os.getenv("PG_HOST"),
                port=os.getenv("PG_PORT")
            )
            print("✅ Conexión a la base de datos exitosa")

            cur = conn.cursor()

            # Verificar si es SUPER ADMIN
            cur.execute("SELECT super_psw FROM super_adm WHERE super_email = %s", (email,))
            result = cur.fetchone()
            print("🧠 Resultado desde DB (super_adm):", result)

            if result:
                db_hash = result[0]
                print("🔐 Hash recuperado:", db_hash)

                match = bcrypt.checkpw(password.encode(), db_hash.encode())
                print("✅ ¿Coincide la contraseña?:", match)

                if match:
                    print("🎉 Login exitoso como Super Admin")
                    return redirect('dashboard')

            # Verificar si es ADMIN DE SUCURSAL
            cur.execute("SELECT adm_id, adm_password FROM adm_user WHERE adm_email = %s", (email,))
            adm_result = cur.fetchone()
            print("🧠 Resultado desde DB (adm_user):", adm_result)

            if adm_result:
                su_adm_id = adm_result[0]
                db_hash = adm_result[1]
                print("🔐 Hash recuperado:", db_hash)

                match = bcrypt.checkpw(password.encode(), db_hash.encode())
                print("✅ ¿Coincide la contraseña?:", match)

                if match:
                    print("🎉 Login exitoso como Admin de Sucursal")

                    # Obtener también el centro_id desde la base de datos
                    cur.execute("SELECT adm_centro_salud FROM adm_user WHERE adm_id = %s", (su_adm_id,))
                    centro_result = cur.fetchone()
                    centro_id = centro_result[0] if centro_result else None

                    # Guardar en sesión
                    request.session['admin_id'] = su_adm_id
                    request.session['centro_id'] = centro_id

                    print("💾 Centro guardado en sesión:", centro_id)

                    return redirect('dashboard_admin_sucursal')

            cur.close()
            conn.close()

            print("❌ Usuario no autenticado")
            return render(request, 'login.html', {'error': 'Credenciales incorrectas'})

        except Exception as e:
            print("🛑 Error durante login:", e)
            return render(request, 'login.html', {'error': 'Error en el servidor'})

    return render(request, 'login.html')

def dashboard(request):
    now = timezone.now()
    ultimas_sucursales = Sucursal.objects.order_by('-id')[:3]
    total_sucursales = Sucursal.objects.count()

    sucursales_ult_mes = Sucursal.objects.filter(
        creado_el__year=now.year,
        creado_el__month=now.month
    ).count()
    usuarios_recientes = AdmUser.objects.select_related(
        'sucursal').order_by('-adm_create_at')[:3]

    return render(request, 'dashboard.html', {
        'ultimas_sucursales': ultimas_sucursales,
        'total_sucursales': total_sucursales,
        'sucursales_ult_mes': sucursales_ult_mes,
        'usuarios_recientes': usuarios_recientes
    })

def sucursales(request):
    sucursales = Sucursal.objects.all()
    return render(request, 'sucursales.html', {'sucursales': sucursales})

def crear_sucursal(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nueva = Sucursal(
            nombre=data['nombre'],
            ubicacion=data['ubicacion'],
            direccion=data['direccion'],
            fono=data['fono']
        )
        nueva.save()
        return JsonResponse({'status': 'ok', 'id': nueva.id})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def users(request):
    usuarios = AdmUser.objects.select_related('sucursal', 'rol_id').all()
    sucursales = Sucursal.objects.all()  # Agregar sucursales para el select
    return render(request, 'users.html', {
        'usuarios': usuarios,
        'sucursales': sucursales
    })

@csrf_exempt
def crear_paciente(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("📦 Datos recibidos del formulario:", data)

            # Calcular edad a partir de la fecha de nacimiento
            from datetime import date
            fecha_nac = date.fromisoformat(data["fecha_nacimiento"])
            today = date.today()
            edad = today.year - fecha_nac.year - ((today.month, today.day) < (fecha_nac.month, fecha_nac.day))

            # Crear paciente
            paciente = Paciente.objects.create(
                nombre=data["nombre"],
                apellido=data["apellido"],
                fecha_nacimiento=data["fecha_nacimiento"],
                genero=data["genero"],
                direccion=data["direccion"],
                telefono=data["telefono"],
                email=data["email"],
                rut=data["rut"],
                id_centro_salud=data["id_centro_salud"]
            )

            # Crear ficha del paciente
            ficha = FichaPaciente.objects.create(
                paciente_id=paciente.id,
                centro_salud_id=data["id_centro_salud"],
                fecha_creacion=timezone.now(),
                historial_medico=data["historial_medico"],
                tipo_sangre=data["tipo_sangre"],
                contacto_emergencia=data["contacto_emergencia"],
                activo=data.get("activo", True),
                altura=data["altura"],
                peso=data["peso"],
                parentesco_contacto=data["parentesco_contacto"],
                nombre=data["nombre"],
                apellido=data["apellido"],
                rut=data["rut"],
                email=data["email"],
                celular=data["telefono"],
                direccion=data["direccion"],
                fecha_nac=data["fecha_nacimiento"],
                edad=edad
            )

            paciente.id_ficha_paciente = ficha.id
            paciente.save()

            return JsonResponse({"status": "ok", "paciente_id": paciente.id})

        except Exception as e:
            print("🧨 Error en crear_paciente:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def crear_medico(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            hashed_password = None
            if data.get("password"):
                hashed_password = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

            nuevo_medico = Medico.objects.create(
                nombre=data["nombre"],
                apellido=data["apellido"],
                esp_id=int(data["esp_id"]),
                especialidad=data["especialidad"],
                telefono=data["telefono"],
                email=data["email"],
                rut=data["rut"],
                id_centro_salud=data["id_centro_salud"],
                password=hashed_password
            )

            return JsonResponse({"status": "ok", "medico_id": nuevo_medico.id})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)

def dashboard_admin_sucursal(request):
    centro_id = request.session.get("centro_id")
    centro = Sucursal.objects.get(id=centro_id)

    medicos = Medico.objects.filter(id_centro_salud=centro.id)
    total_medicos = medicos.count()

    pacientes = Paciente.objects.filter(id_centro_salud=centro.id)

    from datetime import date
    def calcular_edad(fecha_nacimiento):
        today = date.today()
        return today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))

    for paciente in pacientes:
        try:
            ficha = FichaPaciente.objects.get(paciente_id=paciente.id)
            paciente.edad = calcular_edad(paciente.fecha_nacimiento)
        except FichaPaciente.DoesNotExist:
            paciente.edad = "N/A"

    insumos = Insumo.objects.filter(id_centro_salud=centro)

    return render(request, "AdminSucursal/dashboard-admin-sucursal.html", {
        "centro": centro,
        "medicos": medicos,
        "pacientes": pacientes,
        "insumos": insumos,
        "total_medicos": total_medicos
    })

@csrf_exempt
def crear_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("📦 Datos recibidos para crear usuario:", data)
            
            # Validar que todos los campos requeridos estén presentes
            required_fields = ['nombre', 'apellido', 'email', 'contrasena', 'centro_salud']
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({
                        'success': False, 
                        'error': f'El campo {field} es requerido'
                    }, status=400)
            
            # Verificar que el email no esté ya registrado
            if AdmUser.objects.filter(adm_email=data['email']).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Ya existe un usuario con este email'
                }, status=400)
            
            # Verificar que la sucursal existe
            try:
                sucursal = Sucursal.objects.get(id=data['centro_salud'])
            except Sucursal.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Centro de salud no encontrado'
                }, status=400)
            
            # Encriptar la contraseña
            password = data['contrasena']
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
            
            # Obtener un rol por defecto - asignar rol "Administrador" (rol_id = 1)
            try:
                # Buscar específicamente el rol "Administrador" para admin de sucursales
                rol = Rol.objects.filter(rol_name='Administrador').first()
                if not rol:
                    # Si no existe, obtener el primer rol disponible
                    rol = Rol.objects.first()
                print(f"🔧 Rol encontrado: ID={rol.rol_id}, Nombre={rol.rol_name}")
            except Exception as e:
                print(f"⚠️ Error al buscar rol: {e}")
                rol = None  # Si hay algún error, crear usuario sin rol
            
            print(f"🔧 Rol asignado: {rol.rol_name if rol else 'Sin rol'}")
            
            # Crear el usuario
            nuevo_usuario = AdmUser.objects.create(
                adm_name=data['nombre'],
                adm_last_name=data['apellido'],
                adm_email=data['email'],
                adm_password=hashed_password,
                sucursal=sucursal,
                rol_id=rol,
                adm_create_at=timezone.now()
            )
            
            # Actualizar el contador de usuarios en la sucursal
            sucursal.usuarios = AdmUser.objects.filter(sucursal=sucursal).count()
            sucursal.save()
            
            print(f"✅ Usuario creado exitosamente: {nuevo_usuario.adm_name} {nuevo_usuario.adm_last_name}")
            
            return JsonResponse({
                'success': True,
                'message': 'Usuario creado exitosamente',
                'usuario_id': nuevo_usuario.adm_id
            })
            
        except Exception as e:
            print(f"❌ Error al crear usuario: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Error interno del servidor: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)

@csrf_exempt
def editar_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("📦 Datos recibidos para editar usuario:", data)
            
            # Validar que el usuario_id esté presente
            if 'usuario_id' not in data or not data['usuario_id']:
                return JsonResponse({
                    'success': False, 
                    'error': 'ID de usuario requerido'
                }, status=400)
            
            # Validar que los campos requeridos estén presentes
            required_fields = ['nombre', 'apellido']
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({
                        'success': False, 
                        'error': f'El campo {field} es requerido'
                    }, status=400)
            
            # Buscar el usuario
            try:
                usuario = AdmUser.objects.get(adm_id=data['usuario_id'])
            except AdmUser.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Usuario no encontrado'
                }, status=404)
            
            # Actualizar los campos editables
            usuario.adm_name = data['nombre']
            usuario.adm_last_name = data['apellido']
            
            # Actualizar contraseña solo si se proporcionó
            if 'contrasena' in data and data['contrasena']:
                password = data['contrasena']
                if len(password) < 6:
                    return JsonResponse({
                        'success': False,
                        'error': 'La contraseña debe tener al menos 6 caracteres'
                    }, status=400)
                
                # Encriptar la nueva contraseña
                salt = bcrypt.gensalt()
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
                usuario.adm_password = hashed_password
                print(f"🔐 Contraseña actualizada para usuario {usuario.adm_name}")
            
            # Guardar los cambios
            usuario.save()
            
            print(f"✅ Usuario actualizado exitosamente: {usuario.adm_name} {usuario.adm_last_name}")
            
            return JsonResponse({
                'success': True,
                'message': 'Usuario actualizado exitosamente',
                'usuario_id': usuario.adm_id
            })
            
        except Exception as e:
            print(f"❌ Error al editar usuario: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Error interno del servidor: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)