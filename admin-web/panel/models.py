from django.db import models

# Create your models here.
from django.db import models
class Sucursal(models.Model):
    nombre = models.TextField()
    ubicacion = models.TextField()
    direccion = models.TextField()
    fono = models.TextField()
    usuarios = models.IntegerField()

    def __str__(self):
        return self.nombre
    class Meta:
        db_table = 'centro_salud'
        managed = False