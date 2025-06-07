from rest_framework import viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.generic import ListView
from rest_framework import generics
from django.utils import timezone
from .models import Doctor, TimeSlot, Appointment, PatientProfile, Availability
from .serializers import (
    DoctorSerializer, 
    TimeSlotSerializer, 
    AppointmentSerializer, 
    PatientProfileSerializer,
    AvailabilitySerializer,
    User
)
from . import serializers
from .models import Appointment, PatientProfile  
from .serializers import AppointmentSerializer, PatientProfileSerializer

def home(request):
    return render(request, 'appointments/home.html') 

class DoctorCreateView(APIView):
    permission_classes = [permissions.AllowAny]  
    
    def post(self, request):
        return Response({"message": "Success"})

class DoctorListView(ListView):
    model = Doctor
    template_name = "appointments/doctor_list.html"
    context_object_name = "doctors"
    paginate_by = 10 

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by('name') 
    serializer_class = DoctorSerializer
    authentication_classes = [TokenAuthentication]

class DoctorAvailabilityView(APIView):
    def get(self, request, pk):
        doctor = get_object_or_404(Doctor, pk=pk)
        availabilities = Availability.objects.filter(doctor=doctor) 
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Appointment.objects.all().order_by('id')
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Appointment.objects.none()
            
        if hasattr(user, 'patientprofile'):
            return Appointment.objects.filter(patient=user.patientprofile)
        elif hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("Authentication required")
            
        if hasattr(user, 'patientprofile'):
            serializer.save(patient=user.patientprofile)
        elif hasattr(user, 'doctor'):
            serializer.save(doctor=user.doctor)
        else:
            raise PermissionDenied({
                "detail": "You need to complete either a patient or doctor profile",
                "patient_profile_url": "/api/v1/patient-profiles/",
                "doctor_profile_url": "/api/v1/doctor-profiles/"
            })
        
class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'doctor'):
            return TimeSlot.objects.filter(doctor=user.doctor)
        return TimeSlot.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'doctor'):
            serializer.save(doctor=self.request.user.doctor)
        else:
            raise PermissionDenied("Only doctors can create time slots")


class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'patientprofile'):
            return PatientProfile.objects.filter(user=user)
        return PatientProfile.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'patientprofile'):
            raise PermissionDenied("You already have a patient profile")
        serializer.save(user=self.request.user)