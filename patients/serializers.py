from rest_framework import serializers
from .models import Patient, ClinicalNote, ClinicalHistory

class ClinicalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalNote
        fields = '__all__'

class ClinicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalHistory
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    notes = ClinicalNoteSerializer(many=True, read_only=True)
    clinical_history = ClinicalHistorySerializer(read_only=True)
    class Meta:
        model = Patient
        fields = '__all__'
