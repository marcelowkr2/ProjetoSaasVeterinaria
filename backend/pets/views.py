from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Especie, Raca, Tutor, Pet, Vacina, VacinaAplicada
from .serializers import (
    EspecieSerializer, RacaSerializer, TutorSerializer, 
    PetSerializer, VacinaSerializer, VacinaAplicadaSerializer
)

class EspecieList(generics.ListAPIView):
    queryset = Especie.objects.all()
    serializer_class = EspecieSerializer
    permission_classes = [permissions.IsAuthenticated]

class RacaList(generics.ListAPIView):
    serializer_class = RacaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        especie_id = self.request.query_params.get('especie')
        if especie_id:
            return Raca.objects.filter(especie_id=especie_id)
        return Raca.objects.all()

class TutorList(generics.ListCreateAPIView):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer
    permission_classes = [permissions.IsAuthenticated]

class PetListCreate(generics.ListCreateAPIView):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Filtra pets pelo tutor (se usuário for tutor)
        user = self.request.user
        if user.user_type == 4:  # Tutor
            return Pet.objects.filter(tutor__user=user)
        return Pet.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()

class PetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

class VacinaAplicadaCreate(generics.CreateAPIView):
    queryset = VacinaAplicada.objects.all()
    serializer_class = VacinaAplicadaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(veterinario=self.request.user)