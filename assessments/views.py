from rest_framework import viewsets
from .models import Instrument, Assessment, NeuroAssessment
from .serializers import InstrumentSerializer, AssessmentSerializer, NeuroAssessmentSerializer

class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class NeuroAssessmentViewSet(viewsets.ModelViewSet):
    queryset = NeuroAssessment.objects.all()
    serializer_class = NeuroAssessmentSerializer
