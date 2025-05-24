from django.shortcuts import render, redirect
import psycopg2
import bcrypt
import os
from dotenv import load_dotenv
from .models import Sucursal, AdmUser
import json
from django.http import JsonResponse
from django.utils import timezone

def login_admin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        print("📩 Email recibido:", email)
        print("🔒 Password recibido:", password)

        # Aca podemos agregar variables para el entorno pero por ahora no lo estoy usando
        load_dotenv()

        try:
            # Conexión a PostgreSQL
            conn = psycopg2.connect(
                dbname=os.getenv("PG_DBNAME"),
                user=os.getenv("PG_USER"),
                password=os.getenv("PG_PASSWORD"),
                host=os.getenv("PG_HOST"),
                port=os.getenv("PG_PORT")
            )
            print("✅ Conexión a la base de datos exitosa")

            cur = conn.cursor()
            cur.execute("SELECT super_psw FROM super_adm WHERE super_email = %s", (email,))
            result = cur.fetchone()
            print("🧠 Resultado desde DB:", result)

            cur.close()
            conn.close()

            if result:
                db_hash = result[0]
                print("🔐 Hash recuperado:", db_hash)

                match = bcrypt.checkpw(password.encode(), db_hash.encode())
                print("✅ ¿Coincide la contraseña?:", match)

                if match:
                    print("🎉 Login exitoso")
                    return redirect('dashboard')
                else:
                    print("❌ Contraseña incorrecta")
            else:
                print("❌ No se encontró el usuario")

            return render(request, 'login.html', {'error': 'Credenciales incorrectas'})

        except Exception as e:
            print("🛑 Error durante login:", e)
            return render(request, 'login.html', {'error': 'Error en el servidor'})

    return render(request, 'login.html')

def dashboard(request):
    now = timezone.now()
    ultimas_sucursales = Sucursal.objects.order_by('-id')[:3]
    total_sucursales = Sucursal.objects.count()

    #Filtrar sucursales creadas el ultimo mes
    sucursales_ult_mes = Sucursal.objects.filter(
        creado_el__year=now.year,
        creado_el__month=now.month
    ).count()
    usuarios_recientes = AdmUser.objects.select_related(
        'sucursal').order_by('-adm_create_at')[:3]

    return render(request, 'dashboard.html', {
        'ultimas_sucursales': ultimas_sucursales,
        'total_sucursales':total_sucursales,
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
    users = AdmUser.objects.all().select_related('sucursal')
    return render(request, 'users.html', {'users': users})

