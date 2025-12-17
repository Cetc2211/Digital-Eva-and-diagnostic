from django.db import models
import uuid

class Patient(models.Model):
    # Ficha de identificación
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    paternal_last_name = models.CharField(max_length=100, verbose_name="Apellido Paterno", default="")
    maternal_last_name = models.CharField(max_length=100, verbose_name="Apellido Materno", blank=True, default="")
    
    # Keeping original last_name for backward compatibility if needed, but we should migrate to specific ones or use properties.
    # For this task, I will deprecate 'last_name' usage in favor of paternal/maternal, but to avoid migration issues with existing data (if any), I'll handle it.
    # Since it's early stage, I'll remove 'last_name' and replace with paternal/maternal.
    
    date_of_birth = models.DateField(verbose_name="Fecha de nacimiento")
    gender = models.CharField(max_length=50, verbose_name="Sexo") # e.g., Male, Female, Non-binary
    
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
            # Simple auto-increment-like folio or UUID based. 
            # A timestamp based or UUID based is safer for concurrency without extra lock logic.
            # Let's use a count-based prefix for readability as requested "assigned automatically".
            # To be safe and simple: "P-{count+1:04d}"
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
