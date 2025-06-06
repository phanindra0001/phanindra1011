"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Calendar, Clock, User, Phone, Mail, FileText, Home } from "lucide-react"
import { format } from "date-fns"

interface Doctor {
  id: number
  name: string
  specialty: string
  image: string
}

interface BookingData {
  id: string
  doctor: Doctor
  date: Date
  time: string
  patient: {
    name: string
    email: string
    phone: string
  }
  reason: string
  status: string
  createdAt: Date
}

interface AppointmentConfirmationProps {
  bookingData: BookingData
  onNewAppointment: () => void
}

export default function AppointmentConfirmation({ bookingData, onNewAppointment }: AppointmentConfirmationProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl text-green-700">Appointment Confirmed!</CardTitle>
        <CardDescription>
          Your appointment has been successfully booked. You will receive a confirmation email shortly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Reference */}
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Booking Reference</p>
          <p className="text-xl font-mono font-bold text-green-800">#{bookingData.id.toUpperCase()}</p>
        </div>

        {/* Doctor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Doctor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={bookingData.doctor.image || "/placeholder.svg"} alt={bookingData.doctor.name} />
                <AvatarFallback>
                  {bookingData.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{bookingData.doctor.name}</h3>
                <Badge variant="secondary">{bookingData.doctor.specialty}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-gray-600">{format(bookingData.date, "EEEE, MMMM do, yyyy")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-gray-600">{bookingData.time}</p>
              </div>
            </div>

            {bookingData.reason && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Reason for Visit</p>
                  <p className="text-gray-600">{bookingData.reason}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Name</p>
                <p className="text-gray-600">{bookingData.patient.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{bookingData.patient.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{bookingData.patient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please arrive 15 minutes before your appointment time</li>
              <li>• Bring a valid ID and insurance card</li>
              <li>• If you need to reschedule, please call at least 24 hours in advance</li>
              <li>• You will receive a reminder email 24 hours before your appointment</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onNewAppointment} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Book Another Appointment
          </Button>
          <Button onClick={() => window.print()} className="flex-1">
            Print Confirmation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
