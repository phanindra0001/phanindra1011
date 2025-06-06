"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, AlertCircle, RefreshCw, Star, Clock, ArrowLeft } from "lucide-react"

interface Doctor {
  id: number
  name: string
  specialtyId: number
  specialty: string
  experience: string
  rating: number
  availability: string
  image: string
}

interface ApiResponse {
  success: boolean
  data?: Doctor[]
  error?: string
}

interface DoctorSelectorProps {
  specialtyId: number
  specialtyName: string
  onBack: () => void
  onDoctorSelect: (doctor: Doctor) => void
}

export default function DoctorSelector({ specialtyId, specialtyName, onBack, onDoctorSelect }: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/doctors?specialtyId=${specialtyId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()

      if (!responseText) {
        throw new Error("Empty response received")
      }

      let data: ApiResponse
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError)
        console.error("Response text:", responseText)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
      }

      if (data.success && data.data) {
        setDoctors(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch doctors")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching doctors:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [specialtyId])

  const handleRetry = () => {
    fetchDoctors()
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleContinue = () => {
    if (selectedDoctor) {
      onDoctorSelect(selectedDoctor)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a {specialtyName} specialist</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading doctors...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a {specialtyName} specialist</CardDescription>
            </div>
          </div>
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Select Doctor</CardTitle>
            <CardDescription>
              Choose a {specialtyName} specialist ({doctors.length} available)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedDoctor?.id === doctor.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleDoctorSelect(doctor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <Badge variant="secondary" className="mb-2">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Experience:</strong> {doctor.experience}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedDoctor && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 mb-2">
              <strong>Selected:</strong> {selectedDoctor.name}
            </p>
            <Button onClick={handleContinue}>Continue to Appointment Booking</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
