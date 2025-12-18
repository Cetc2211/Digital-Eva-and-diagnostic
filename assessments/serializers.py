from rest_framework import serializers
from .models import Instrument, Assessment, NeuroAssessment

class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class NeuroAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NeuroAssessment
        fields = '__all__'
