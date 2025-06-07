from django import forms
from .models import ( Appointment, PatientProfile, Specialty, TimeSlot, Doctor)

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['patient', 'time_slot', 'status', 'symptoms']

class PatientProfileForm(forms.ModelForm):
    class Meta:
        model = PatientProfile
        fields = ['date_of_birth', 'blood_type', 'allergies']

class DoctorForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ['specialty', 'license_number', 'hospital_affiliation']

class TimeSlotForm(forms.ModelForm):
    class Meta:
        model = TimeSlot
        fields = ['doctor', 'date', 'start_time', 'end_time', 'is_available']

class AppointmentStatusForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['status']