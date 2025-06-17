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
    
class Medico(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.TextField()
    apellido = models.TextField()
    especialidad = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.TextField()
    email = models.TextField()
    password = models.TextField(null=True)
    rut = models.TextField()
    esp_id = models.IntegerField()
    id_centro_salud = models.IntegerField()

    class Meta:
        db_table = 'medicos'
        managed = False

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
class Paciente(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.TextField()
    apellido = models.TextField()
    fecha_nacimiento = models.DateField()
    genero = models.TextField()
    direccion = models.TextField()
    telefono = models.TextField()
    email = models.TextField()
    rut = models.TextField()
    id_ficha_paciente = models.BigIntegerField()
    id_centro_salud = models.BigIntegerField()

    class Meta:
        db_table = 'pacientes'
        managed = False

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
class Insumo(models.Model):

    insumo_id = models.BigAutoField(primary_key=True)
    nombre = models.TextField(db_column='nombre_insumo')   
    descripcion = models.TextField()
    cantidad = models.IntegerField()
    id_centro_salud = models.ForeignKey(
        Sucursal,
        on_delete=models.SET_NULL,
        null=True,
        db_column='id_centro_salud'
    )
    class Meta:
        db_table = 'insumo'
        managed = False

    def __str__(self):
        return self.nombre
    
class FichaPaciente(models.Model):
    id = models.BigAutoField(primary_key=True)
    paciente_id = models.BigIntegerField()
    centro_salud_id = models.BigIntegerField()
    fecha_creacion = models.DateTimeField()
    historial_medico = models.TextField()
    tipo_sangre = models.TextField()
    contacto_emergencia = models.TextField()
    activo = models.BooleanField(default=True)
    altura = models.IntegerField()
    peso = models.IntegerField()
    parentesco_contacto = models.CharField(db_column="parentezco_contacto", max_length=100)

    # Campos adicionales necesarios para que el formulario no falle:
    nombre = models.TextField(null=True)
    apellido = models.TextField(null=True)
    rut = models.TextField(null=True)
    email = models.TextField(null=True)
    celular = models.TextField(null=True)
    direccion = models.TextField(null=True)
    fecha_nac = models.DateField(null=True)
    edad = models.IntegerField(null=True)  

    class Meta:
        db_table = 'ficha_paciente'
        managed = False 

    def __str__(self):
        return f"Ficha {self.id} - Paciente {self.paciente_id}"