from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from doctorbooking.appointments.models import Doctor

class DoctorAPITests(APITestCase):
    def test_doctor_list(self):
        response = self.client.get('/api/v1/doctors/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), Doctor.objects.count())

class ProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='phanindra10',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_profile_creation(self):
        profile_data = {
            'user': self.user.id,
            'date_of_birth': '1990-01-01',
            'blood_type': 'O+',
            'allergies': 'None',
            'gender': 'M',
            'height_cm': 175,
            'weight_kg': 70
        }
        response = self.client.post('/api/v1/patient-profiles/', profile_data, format='json')
        print(response.status_code, response.json())