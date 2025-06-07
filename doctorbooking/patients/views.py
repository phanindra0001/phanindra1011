from django.shortcuts import render
from django.http import HttpResponse

def patient_profiles(request):
    return HttpResponse("Patient Profiles API Endpoint")


