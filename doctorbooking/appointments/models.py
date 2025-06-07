from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.specialization})"
    
        
    
class Availability(models.Model):
    DAYS_OF_WEEK = (
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
        (7, 'Sunday'),
    )
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField(choices=DAYS_OF_WEEK)  
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor.name} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"

class PatientProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=False)  
    date_of_birth = models.DateField()
    blood_type = models.CharField(max_length=5)
    allergies = models.TextField(blank=True)
    
    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

class TimeSlot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('doctor', 'date', 'start_time')
    
    def __str__(self):
        return f"{self.date} {self.start_time}-{self.end_time} with Dr. {self.doctor.user.last_name}"

class Appointment(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    date_time = models.DateTimeField(default=timezone.now)
    duration = models.PositiveIntegerField(default=30) 
    help_text="Duration in minutes"
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('booked', 'Booked'),
        ('completed', 'Completed'), 
        ('cancelled', 'Cancelled')
    ])

    class Meta:
        db_table = 'appointments_appointment'

    def __str__(self):
        return f"Appointment #{self.id} - {self.patient.user.get_full_name()}"