from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from patients.views import PatientViewSet, ClinicalNoteViewSet, ClinicalHistoryViewSet
from assessments.views import InstrumentViewSet, AssessmentViewSet, NeuroAssessmentViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'notes', ClinicalNoteViewSet)
router.register(r'clinical_histories', ClinicalHistoryViewSet)
router.register(r'instruments', InstrumentViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'neuro_assessments', NeuroAssessmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
