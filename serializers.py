from rest_framework import serializers
from .models import Patient, ClinicalNote

class ClinicalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalNote
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    notes = ClinicalNoteSerializer(many=True, read_only=True)
    class Meta:
        model = Patient
        fields = '__all__'
