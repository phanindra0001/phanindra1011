from django.contrib import admin
from .models import Doctor
from django.contrib import admin
from .models import Doctor, Appointment
from .models import PatientProfile

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization')
    search_fields = ('name', 'specialization')

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'date_time', 'duration', 'status')
    list_filter = ('status', 'doctor', 'date_time')
    search_fields = ('patient__username', 'doctor__username', 'notes')
    date_hierarchy = 'date_time'  
    ordering = ('-date_time',)  
    list_editable = ('status',)
    list_per_page = 20

    def formatted_date(self, obj):
        return obj.date_time.date()
    formatted_date.short_description = 'Date'

    def formatted_time(self, obj):
        return obj.date_time.time()
    formatted_time.short_description = 'Time'

@admin.register(PatientProfile)  
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date_of_birth', 'blood_type', 'allergies')
    list_filter = ('blood_type',)
    search_fields = ('user__username', 'blood_type', 'allergies')
    raw_id_fields = ('user',)  
    ordering = ('-date_of_birth',)