from django.shortcuts import render, redirect
import psycopg2
import bcrypt
import os
from dotenv import load_dotenv
from .models import Sucursal, AdmUser, Rol
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
                    request.session['admin_id'] = su_adm_id  # Guardar el ID en sesión
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


# Vista de administrador de sucursal
def dashboard_admin_sucursal(request):
    adm_id = request.session.get('admin_id')
    try:
        centro = Sucursal.objects.get(adm_id=adm_id)
    except Sucursal.DoesNotExist:
        return render(request, 'login.html', {'error': 'Sucursal no encontrada'})

    from .models import Medico, Paciente, Insumo  # Asegúrate de tenerlos definidos

    total_medicos = Medico.objects.filter(id_centro_salud=centro.id).count()
    total_pacientes = Paciente.objects.filter(id_centro_salud=centro.id).count()
    insumos = Insumo.objects.filter(id_centro_salud=centro.id)

    return render(request, 'AdminSucursal/dashboard-admin-sucursal.html', {
        'centro': centro,
        'total_medicos': total_medicos,
        'total_pacientes': total_pacientes,
        'insumos': insumos
    })