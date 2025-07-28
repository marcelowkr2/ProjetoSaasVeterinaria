from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        (1, 'Admin'),
        (2, 'Veterinário'),
        (3, 'Recepcionista'),
        (4, 'Tutor'),
    )
    
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, default=4)
    phone = models.CharField(max_length=20, blank=True)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    crmv = models.CharField(max_length=20, null=True, blank=True)  # Apenas para veterinários
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"