from django.db import models

class Patient(models.Model):
    # Ficha de identificación
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    paternal_last_name = models.CharField(max_length=100, verbose_name="Apellido Paterno", default="")
    maternal_last_name = models.CharField(max_length=100, verbose_name="Apellido Materno", blank=True, default="")

    date_of_birth = models.DateField(verbose_name="Fecha de nacimiento")
    gender = models.CharField(max_length=50, verbose_name="Sexo")

    place_of_residence = models.CharField(max_length=200, verbose_name="Lugar de residencia", blank=True)
    marital_status = models.CharField(max_length=50, verbose_name="Estado civil", blank=True)
    sexual_orientation = models.CharField(max_length=50, verbose_name="Orientación sexual", blank=True)

    address = models.TextField(verbose_name="Domicilio", blank=True)

    # Contact Info
    landline_number = models.CharField(max_length=20, verbose_name="Número de contacto", blank=True)
    mobile_number = models.CharField(max_length=20, verbose_name="Número Celular", blank=True)
    whatsapp_is_mobile = models.BooleanField(default=False, verbose_name="WhatsApp es el mismo")
    email = models.EmailField(verbose_name="Correo electrónico", blank=True)

    consultation_date = models.DateField(verbose_name="Fecha de contacto para consulta", null=True, blank=True)

    folio_number = models.CharField(max_length=50, unique=True, editable=False, verbose_name="Número de folio")

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.folio_number:
            last_id = Patient.objects.all().order_by('id').last()
            new_id = (last_id.id + 1) if last_id else 1
            self.folio_number = f"EXP-{new_id:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.paternal_last_name} {self.maternal_last_name}".strip()

class ClinicalNote(models.Model):
    patient = models.ForeignKey(Patient, related_name='notes', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    note_type = models.CharField(max_length=50, default='general')

    def __str__(self):
        return f"{self.title} - {self.patient}"

class ClinicalHistory(models.Model):
    patient = models.OneToOneField(Patient, related_name='clinical_history', on_delete=models.CASCADE)

    # General Data
    laterality = models.CharField(max_length=20, choices=[('right', 'Diestro'), ('left', 'Zurdo'), ('ambidextrous', 'Ambidextro')], blank=True)
    father_education = models.IntegerField(verbose_name="Escolaridad Padre (años)", default=0)
    mother_education = models.IntegerField(verbose_name="Escolaridad Madre (años)", default=0)

    consultation_reason = models.TextField(verbose_name="Motivo de Consulta")
    alert_state = models.CharField(max_length=100, verbose_name="Estado de Alerta", blank=True)

    # Medical/Neurological & Family History stored as JSON
    medical_family_history = models.JSONField(default=dict, verbose_name="Antecedentes Médicos y Heredofamiliares")

    # Development History
    development_history = models.JSONField(default=dict, verbose_name="Antecedentes del Desarrollo")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Historia Clínica - {self.patient}"
