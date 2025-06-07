from . import views 
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'doctors', views.DoctorViewSet, basename='doctor')
router.register('appointments', views.AppointmentViewSet, basename='appointment')
router.register(r'patient-profiles', views.PatientProfileViewSet, basename='patientprofile')
urlpatterns = [
    path('', include(router.urls)),
    path('doctors/<int:pk>/availability/', views.DoctorAvailabilityView.as_view(), name='doctor-availability'),
]