from django.db import models

# Create your models here.
from django.db import models
class Sucursal(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.TextField()
    ubicacion = models.TextField()
    direccion = models.TextField()
    fono = models.TextField()
    usuarios = models.IntegerField(null=False, default=0)
    creado_el = models.DateTimeField(null=True)
    adm_id = models.ForeignKey(
        'AdmUser',
        on_delete=models.SET_NULL,
        null=True,
        db_column='adm_id',
        related_name='sucursales'
    )

    def __str__(self):
        return self.nombre
    class Meta:
        db_table = 'centro_salud'
        managed = False

class AdmUser(models.Model):
    adm_id = models.AutoField(primary_key=True)
    adm_name = models.CharField(max_length=100)
    adm_last_name = models.CharField(max_length=100)
    adm_email = models.EmailField(unique=True)
    adm_password = models.TextField()
    sucursal = models.ForeignKey(
        Sucursal,
        on_delete=models.SET_NULL,
        null=True,
        db_column='adm_centro_salud'
    )
    adm_create_at = models.DateTimeField(null=True)
    rol_id = models.ForeignKey(
        'Rol',
        on_delete=models.SET_NULL,
        null=True,
        db_column='rol_id'
    )

    def __str__(self):
        return f"{self.adm_name} {self.adm_last_name}"
    class Meta:
        db_table = 'adm_user'
        managed = False


class Rol(models.Model):
    rol_id = models.AutoField(primary_key=True)
    rol_name = models.CharField(max_length=100)
    rol_desc = models.TextField()
    class Meta:
        db_table = 'roles'
        managed = False
    
    def __str__(self):
        return self.rol_name