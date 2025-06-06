"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import DoctorSelector from "./doctor-selector"
import AppointmentBooking from "./appointment-booking"
import AppointmentConfirmation from "./appointment-confirmation"

interface Specialty {
  id: number
  name: string
  description: string
}

interface ApiResponse {
  success: boolean
  data?: Specialty[]
  error?: string
}

export default function SpecialtySelector() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState<"specialty" | "doctor" | "booking" | "confirmation">("specialty")
  const [selectedSpecialtyData, setSelectedSpecialtyData] = useState<{ id: number; name: string } | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)

  const fetchSpecialties = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/specialties")

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get response text first to debug
      const responseText = await response.text()

      // Check if response is empty
      if (!responseText) {
        throw new Error("Empty response received")
      }

      // Try to parse JSON
      let data: ApiResponse
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError)
        console.error("Response text:", responseText)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
      }

      if (data.success && data.data) {
        setSpecialties(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch specialties")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching specialties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecialties()
  }, [])

  const handleRetry = () => {
    fetchSpecialties()
  }

  const handleSpecialtySelect = (specialtyId: number) => {
    setSelectedSpecialty(specialtyId)
  }

  const handleContinueToDoctor = () => {
    if (selectedSpecialty) {
      const specialty = specialties.find((s) => s.id === selectedSpecialty)
      if (specialty) {
        setSelectedSpecialtyData({ id: specialty.id, name: specialty.name })
        setCurrentStep("doctor")
      }
    }
  }

  const handleBackToSpecialty = () => {
    setCurrentStep("specialty")
    setSelectedSpecialtyData(null)
  }

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor)
    setCurrentStep("booking")
  }

  const handleBackToDoctor = () => {
    setCurrentStep("doctor")
  }

  const handleBookingComplete = (booking: any) => {
    setBookingData(booking)
    setCurrentStep("confirmation")
  }

  const handleNewAppointment = () => {
    setCurrentStep("specialty")
    setSelectedSpecialty(null)
    setSelectedSpecialtyData(null)
    setSelectedDoctor(null)
    setBookingData(null)
  }

  if (currentStep === "doctor" && selectedSpecialtyData) {
    return (
      <DoctorSelector
        specialtyId={selectedSpecialtyData.id}
        specialtyName={selectedSpecialtyData.name}
        onBack={handleBackToSpecialty}
        onDoctorSelect={handleDoctorSelect}
      />
    )
  }

  if (currentStep === "booking" && selectedDoctor && selectedSpecialtyData) {
    return (
      <AppointmentBooking
        doctor={selectedDoctor}
        specialtyName={selectedSpecialtyData.name}
        onBack={handleBackToDoctor}
        onBookingComplete={handleBookingComplete}
      />
    )
  }

  if (currentStep === "confirmation" && bookingData) {
    return <AppointmentConfirmation bookingData={bookingData} onNewAppointment={handleNewAppointment} />
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Select Medical Specialty</CardTitle>
          <CardDescription>Choose the medical specialty for your appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading specialties...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Select Medical Specialty</CardTitle>
          <CardDescription>Choose the medical specialty for your appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Error:</strong> {error}
                </p>
                <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select Medical Specialty</CardTitle>
        <CardDescription>Choose the medical specialty for your appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((specialty) => (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSpecialty === specialty.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleSpecialtySelect(specialty.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{specialty.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{specialty.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedSpecialty && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              <strong>Selected:</strong> {specialties.find((s) => s.id === selectedSpecialty)?.name}
            </p>
            <Button onClick={handleContinueToDoctor}>Continue to Doctor Selection</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
