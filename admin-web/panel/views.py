from django.shortcuts import render, redirect
import psycopg2
import bcrypt

def login_admin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        # Conecta a tu base de datos PostgreSQL
        conn = psycopg2.connect(
            dbname='cuidarnodb',
            user='avnadmin',
            password='AVNS_Wg-HpBDgRr-paqEj5OJ',
            host='cuidarnosdb-cuidarnosapp.j.aivencloud.com',
            port='10854'
        )
        cur = conn.cursor()
        cur.execute("SELECT admin_psw FROM administrador WHERE admin_email = %s", (email,))
        result = cur.fetchone()
        cur.close()
        conn.close()

        if result and bcrypt.checkpw(password.encode(), result[0].encode()):
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Credenciales incorrectas'})

    return render(request, 'login.html')

def dashboard(request):
    return render(request, 'dashboard.html')