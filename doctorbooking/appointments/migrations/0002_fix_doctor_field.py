from django.db import migrations
from django.db import models


from django.db import migrations, models

def set_default_doctor(apps, schema_editor):
    Appointment = apps.get_model('appointments', 'Appointment')
    Doctor = apps.get_model('appointments', 'Doctor')
    
  
    if Appointment.objects.filter(doctor__isnull=True).exists():
        default_doctor, created = Doctor.objects.get_or_create(
            name="Default System Doctor",
            defaults={
                'specialization': 'General Medicine',
                'is_active': True,  
                'bio': 'Automatically created system doctor',
                
            }
        )
        
        # Update appointments
        updated = Appointment.objects.filter(doctor__isnull=True).update(doctor=default_doctor)
        print(f"Updated {updated} appointments with default doctor")

def reverse_migration(apps, schema_editor):
    """For reversing the migration - no action needed as field will be reverted"""
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('appointments', '0001_initial'),  
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='doctor',
            field=models.ForeignKey(
                'appointments.Doctor',
                on_delete=models.CASCADE,
                null=True,  
            ),
        ),
        
       
        migrations.RunPython(set_default_doctor, reverse_migration),
        
       
        migrations.AlterField(
            model_name='appointment',
            name='doctor',
            field=models.ForeignKey(
                'appointments.Doctor',
                on_delete=models.CASCADE,
                null=False,  
            ),
        ),
    ]