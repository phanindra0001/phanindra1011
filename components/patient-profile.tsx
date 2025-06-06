"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Pill,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Users,
} from "lucide-react"
import { format, parseISO, differenceInYears } from "date-fns"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalInfo: {
    bloodType: string
    allergies: string[]
    chronicConditions: string[]
    currentMedications: string[]
  }
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
  }
  appointments: Array<{
    id: string
    date: string
    time: string
    reason: string
    status: string
    type: string
    notes: string
    diagnosis: string
    treatment: string
    followUp: string
  }>
}

interface PatientProfileProps {
  patientId: string
  onBack: () => void
}

export default function PatientProfile({ patientId, onBack }: PatientProfileProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/patients?patientId=${patientId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        if (!responseText) {
          throw new Error("Empty response received")
        }

        const data = JSON.parse(responseText)

        if (data.success && data.data && data.data.length > 0) {
          setPatient(data.data[0])
        } else {
          throw new Error("Patient not found")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        console.error("Error fetching patient:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading patient profile...</p>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading patient: {error}</AlertDescription>
      </Alert>
    )
  }

  const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={patient.name} />
              <AvatarFallback className="text-lg">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">
                {age} years old • {patient.gender} • Patient ID: {patient.id}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointment History</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
            <TabsTrigger value="contact">Contact & Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Appointments</p>
                      <p className="text-2xl font-bold">{patient.appointments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">
                        {patient.appointments.filter((apt) => apt.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-2xl font-bold">
                        {
                          patient.appointments.filter((apt) => apt.status === "confirmed" || apt.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Last 3 appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.appointments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{appointment.reason}</p>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(appointment.date), "MMM dd, yyyy")} at {appointment.time}
                          </p>
                          {appointment.diagnosis && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Diagnosis:</strong> {appointment.diagnosis}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Alerts */}
            {(patient.medicalInfo.allergies.length > 0 || patient.medicalInfo.chronicConditions.length > 0) && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Medical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.medicalInfo.allergies.length > 0 && (
                      <div>
                        <p className="font-medium text-red-800">Allergies:</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.medicalInfo.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {patient.medicalInfo.chronicConditions.length > 0 && (
                      <div>
                        <p className="font-medium text-red-800">Chronic Conditions:</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.medicalInfo.chronicConditions.map((condition) => (
                            <Badge key={condition} variant="outline" className="border-red-300 text-red-800">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Appointment History</CardTitle>
                <CardDescription>All appointments with detailed notes and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {patient.appointments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((appointment) => (
                      <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{appointment.reason}</h3>
                              <p className="text-gray-600">
                                {format(parseISO(appointment.date), "EEEE, MMMM dd, yyyy")} at {appointment.time}
                              </p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status}</span>
                            </Badge>
                          </div>

                          {appointment.status === "completed" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {appointment.diagnosis && (
                                <div>
                                  <p className="font-medium text-gray-700">Diagnosis:</p>
                                  <p className="text-gray-600">{appointment.diagnosis}</p>
                                </div>
                              )}
                              {appointment.treatment && (
                                <div>
                                  <p className="font-medium text-gray-700">Treatment:</p>
                                  <p className="text-gray-600">{appointment.treatment}</p>
                                </div>
                              )}
                              {appointment.notes && (
                                <div className="md:col-span-2">
                                  <p className="font-medium text-gray-700">Notes:</p>
                                  <p className="text-gray-600">{appointment.notes}</p>
                                </div>
                              )}
                              {appointment.followUp && (
                                <div>
                                  <p className="font-medium text-gray-700">Follow-up:</p>
                                  <p className="text-gray-600">{appointment.followUp}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Medical Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Basic Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Blood Type</p>
                    <p className="text-gray-600">{patient.medicalInfo.bloodType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-gray-600">
                      {format(parseISO(patient.dateOfBirth), "MMMM dd, yyyy")} ({age} years old)
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="text-gray-600">{patient.gender}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medicalInfo.currentMedications.length > 0 ? (
                    <div className="space-y-2">
                      {patient.medicalInfo.currentMedications.map((medication, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          {medication}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No current medications</p>
                  )}
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medicalInfo.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.medicalInfo.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No known allergies</p>
                  )}
                </CardContent>
              </Card>

              {/* Chronic Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chronic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medicalInfo.chronicConditions.length > 0 ? (
                    <div className="space-y-2">
                      {patient.medicalInfo.chronicConditions.map((condition, index) => (
                        <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                          {condition}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No chronic conditions</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span>{patient.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{patient.emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">{patient.emergencyContact.relationship}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{patient.emergencyContact.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">Provider</p>
                      <p className="text-gray-600">{patient.insurance.provider}</p>
                    </div>
                    <div>
                      <p className="font-medium">Policy Number</p>
                      <p className="text-gray-600">{patient.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Group Number</p>
                      <p className="text-gray-600">{patient.insurance.groupNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
