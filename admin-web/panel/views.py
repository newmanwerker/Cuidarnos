from django.shortcuts import render, redirect
import psycopg2
import bcrypt
import os
from dotenv import load_dotenv
from .models import Sucursal
import json
from django.http import JsonResponse

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
            cur.execute("SELECT admin_psw FROM administrador WHERE admin_email = %s", (email,))
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
    return render(request, 'dashboard.html')

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

