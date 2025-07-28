from django.db import models
from core.models import User

class Especie(models.Model):
    nome = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nome

class Raca(models.Model):
    nome = models.CharField(max_length=100)
    especie = models.ForeignKey(Especie, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.nome} ({self.especie})"

class Tutor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tutor')
    endereco = models.TextField()
    data_cadastro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Tutores'
    
    def __str__(self):
        return str(self.user)

class Pet(models.Model):
    SEXO_CHOICES = (
        ('M', 'Macho'),
        ('F', 'Fêmea'),
    )
    
    nome = models.CharField(max_length=100)
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='pets')
    especie = models.ForeignKey(Especie, on_delete=models.SET_NULL, null=True)
    raca = models.ForeignKey(Raca, on_delete=models.SET_NULL, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    foto = models.ImageField(upload_to='pets/', null=True, blank=True)
    observacoes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.nome} ({self.tutor})"

class Vacina(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    periodo_reforco_meses = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return self.nome

class VacinaAplicada(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='vacinas')
    vacina = models.ForeignKey(Vacina, on_delete=models.CASCADE)
    data_aplicacao = models.DateField()
    data_proximo_reforco = models.DateField(null=True, blank=True)
    veterinario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = 'Vacinas Aplicadas'
    
    def __str__(self):
        return f"{self.vacina} - {self.pet} ({self.data_aplicacao})"