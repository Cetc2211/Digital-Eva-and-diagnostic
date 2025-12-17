from assessments.models import Instrument

# Mood
Instrument.objects.get_or_create(name="Escala de Depresión de Hamilton", category="mood", subcategory="depression", description="Evaluación de depresión.")
Instrument.objects.get_or_create(name="Inventario de Ansiedad de Beck", category="mood", subcategory="anxiety", description="Evaluación de ansiedad.")
Instrument.objects.get_or_create(name="Escala de Autolesión", category="mood", subcategory="self_harm", description="Evaluación de conductas autolesivas.")

# Neuro
Instrument.objects.get_or_create(name="Mini Mental State Exam", category="neuro", subcategory="mental_status", description="Evaluación del estado mental.")
Instrument.objects.get_or_create(name="Test de Stroop", category="neuro", subcategory="executive_functions", description="Evaluación de funciones ejecutivas.")
Instrument.objects.get_or_create(name="Test de Percepción Visual", category="neuro", subcategory="perception", description="Evaluación de percepción.")
Instrument.objects.get_or_create(name="WAIS-IV", category="neuro", subcategory="intelligence", description="Evaluación de inteligencia.")
Instrument.objects.get_or_create(name="Evaluación de Daño Cerebral", category="neuro", subcategory="damage", description="Evaluación por daño.")

# Interviews
Instrument.objects.get_or_create(name="Entrevista Clínica Estructurada", category="interview", subcategory="clinical", description="Entrevista inicial.")
Instrument.objects.get_or_create(name="Entrevista Cognitivo Conductual", category="interview", subcategory="cbt", description="Enfoque CBT.")
Instrument.objects.get_or_create(name="Análisis Funcional de la Conducta", category="interview", subcategory="afc", description="AFC.")

# Forms
Instrument.objects.get_or_create(name="Formato de Consentimiento Informado", category="forms", subcategory="general", description="Formato legal.")

print("Seeded instruments.")
