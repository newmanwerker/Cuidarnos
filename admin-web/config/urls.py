"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from panel import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.login_admin, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('sucursales/', views.sucursales, name='sucursales'),
    path('api/sucursales/crear/', views.crear_sucursal, name='crear_sucursal'),
    path('users/', views.users, name='users'),
    path('dashboard_admin_sucursal/', views.dashboard_admin_sucursal, name='dashboard_admin_sucursal'),
    path('crear_paciente/', views.crear_paciente, name='crear_paciente'),
    path('crear_medico/', views.crear_medico, name='crear_medico'),
    path('users/crear/', views.crear_usuario, name='crear_usuario'),
    path('users/editar/', views.editar_usuario, name='editar_usuario'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),

]
