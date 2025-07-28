from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime, timedelta
from .models import Agendamento, Servico
from pets.models import Pet, Tutor
from pets.serializers import AgendamentoSerializer, ServicoSerializer

class ServicoList(generics.ListAPIView):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    permission_classes = [permissions.IsAuthenticated]

class AgendamentoListCreate(generics.ListCreateAPIView):
    serializer_class = AgendamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        queryset = Agendamento.objects.select_related('pet', 'servico', 'veterinario')
        
        if start_date and end_date:
            queryset = queryset.filter(data__range=[start_date, end_date])
        
        return queryset.order_by('data', 'horario')

class DashboardStats(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        today = datetime.now().date()
        
        stats = {
            'total_pets': Pet.objects.count(),
            'appointments_today': Agendamento.objects.filter(data=today).count(),
            'active_tutors': Tutor.objects.annotate(
                pet_count=Count('pets')
            ).filter(pet_count__gt=0).count(),
        }
        
        return Response(stats)