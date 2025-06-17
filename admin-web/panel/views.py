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
    return render(request, 'users.html', {'usuarios': usuarios})




@csrf_exempt
def crear_paciente(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Obtener datos de paciente
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
                parentesco_contacto=data["parentesco_contacto"]
            )

            paciente.id_ficha_paciente = ficha.id
            paciente.save()

            return JsonResponse({"status": "ok", "paciente_id": paciente.id})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def crear_medico(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Si se envía una contraseña, encriptarla
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