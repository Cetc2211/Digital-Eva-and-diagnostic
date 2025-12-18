from rest_framework import viewsets
from .models import Patient, ClinicalNote, ClinicalHistory
from .serializers import PatientSerializer, ClinicalNoteSerializer, ClinicalHistorySerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class ClinicalNoteViewSet(viewsets.ModelViewSet):
    queryset = ClinicalNote.objects.all()
    serializer_class = ClinicalNoteSerializer

class ClinicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = ClinicalHistory.objects.all()
    serializer_class = ClinicalHistorySerializer
