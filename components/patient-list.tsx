"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, User, Calendar, Phone, Mail, AlertTriangle, Heart } from "lucide-react"
import { differenceInYears, parseISO } from "date-fns"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  medicalInfo: {
    allergies: string[]
    chronicConditions: string[]
  }
  appointments: Array<{
    status: string
  }>
}

interface PatientListProps {
  doctorId: number
  onPatientSelect: (patientId: string) => void
}

export default function PatientList({ doctorId, onPatientSelect }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPatients = async (search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL("/api/patients", window.location.origin)
      url.searchParams.set("doctorId", doctorId.toString())
      if (search) {
        url.searchParams.set("search", search)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      if (!responseText) {
        throw new Error("Empty response received")
      }

      const data = JSON.parse(responseText)

      if (data.success && data.data) {
        setPatients(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch patients")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching patients:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [doctorId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPatients(searchTerm)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <User className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading patients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Error loading patients: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Directory
        </CardTitle>
        <CardDescription>View and manage patient information and history</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients found</p>
              {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth))
              const upcomingAppointments = patient.appointments.filter(
                (apt) => apt.status === "confirmed" || apt.status === "pending",
              ).length
              const hasAlerts =
                patient.medicalInfo.allergies.length > 0 || patient.medicalInfo.chronicConditions.length > 0

              return (
                <Card
                  key={patient.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:bg-gray-50"
                  onClick={() => onPatientSelect(patient.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{patient.name}</h3>
                            {hasAlerts && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Alerts
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>
                                {age} years, {patient.gender}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{patient.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{upcomingAppointments} upcoming</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{patient.appointments.length} total visits</span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Alerts Preview */}
                    {hasAlerts && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalInfo.allergies.slice(0, 2).map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                          {patient.medicalInfo.chronicConditions.slice(0, 2).map((condition) => (
                            <Badge key={condition} variant="outline" className="text-xs border-red-300 text-red-800">
                              {condition}
                            </Badge>
                          ))}
                          {patient.medicalInfo.allergies.length + patient.medicalInfo.chronicConditions.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{patient.medicalInfo.allergies.length + patient.medicalInfo.chronicConditions.length - 4}{" "}
                              more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
