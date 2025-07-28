from rest_framework import serializers
from .models import Pet, Tutor
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'
        extra_kwargs = {
            'peso': {
                'validators': [
                    MinValueValidator(0.1, message="O peso deve ser maior que zero"),
                    MaxValueValidator(100, message="Peso máximo é 100kg")
                ]
            }
        }
    
    def validate_data_nascimento(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("Data de nascimento não pode ser no futuro")
        return value
    
    def validate(self, data):
        if data['sexo'] not in ['M', 'F']:
            raise serializers.ValidationError({"sexo": "Sexo deve ser M ou F"})
        
        if data.get('raca') and data['raca'].especie != data['especie']:
            raise serializers.ValidationError(
                {"raca": "A raça deve corresponder à espécie selecionada"}
            )
        
        return data

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'
    
    def validate(self, data):
        user = data.get('user')
        if user and user.user_type != 4:
            raise serializers.ValidationError(
                {"user": "O usuário deve ser do tipo Tutor"}
            )
        return data