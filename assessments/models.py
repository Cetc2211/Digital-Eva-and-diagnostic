from django.db import models
from patients.models import Patient

class Instrument(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    CATEGORY_CHOICES = [
        ("mood", "Estado de Ánimo"),
        ("neuro", "Evaluación Neuropsicológica"),
        ("interview", "Entrevistas"),
        ("forms", "Formatería"),
    ]
    SUBCATEGORY_CHOICES = [
        ("depression", "Depresión"),
        ("anxiety", "Ansiedad"),
        ("self_harm", "Autolesivos"),
        ("mental_status", "Estado Mental"),
        ("executive_functions", "Funciones Ejecutivas"),
        ("perception", "Percepción"),
        ("intelligence", "Inteligencia"),
        ("damage", "Evaluaciones por Daño"),
        ("clinical", "Clínica"),
        ("cbt", "Cognitivo Conductual"),
        ("afc", "AFC"),
        ("general", "General"),
    ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="mood")
    subcategory = models.CharField(max_length=50, choices=SUBCATEGORY_CHOICES, blank=True, null=True)

    def __str__(self):
        return self.name

class Assessment(models.Model):
    patient = models.ForeignKey(Patient, related_name='assessments', on_delete=models.CASCADE)
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    results = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.instrument.name} - {self.patient}"

class NeuroAssessment(models.Model):
    patient = models.ForeignKey(Patient, related_name='neuro_assessments', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    # Scores stored as JSON
    scores = models.JSONField(default=dict)

    observations = models.TextField(blank=True)

    def __str__(self):
        return f"Evaluación Neuro - {self.patient} - {self.date.strftime('%Y-%m-%d')}"

class Norms(models.Model):
    age_range_start = models.IntegerField()
    age_range_end = models.IntegerField()
    education_level = models.CharField(max_length=20)
    data = models.JSONField()

    def __str__(self):
        return f"Barem {self.age_range_start}-{self.age_range_end} yrs, Edu: {self.education_level}"
