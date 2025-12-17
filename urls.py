from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from patients.views import PatientViewSet, ClinicalNoteViewSet
from assessments.views import InstrumentViewSet, AssessmentViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'notes', ClinicalNoteViewSet)
router.register(r'instruments', InstrumentViewSet)
router.register(r'assessments', AssessmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
