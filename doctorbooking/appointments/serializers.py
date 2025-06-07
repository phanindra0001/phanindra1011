from time import timezone
from typing import Self
from rest_framework import serializers
from .models import Doctor
from django.contrib.auth import get_user_model
from .models import PatientProfile
from typing import Any, Dict
from .models import Availability 
from .models import TimeSlot
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import PatientProfile, Doctor, Appointment, TimeSlot  

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'date', 'start_time', 'end_time', 'is_available']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['patient', 'status']

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'doctor', 'date', 'start_time', 'end_time', 'is_booked']

User = get_user_model()

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data: Dict[str, Any]) -> PatientProfile:
        """Automatically assign the current user to the patient profile."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("You must be authenticated to create a patient profile." )
        validated_data['user'] = request.user
        return super().create(validated_data)

        