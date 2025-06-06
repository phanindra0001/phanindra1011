"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Stethoscope } from "lucide-react"

interface Doctor {
  id: number
  name: string
  specialty: string
  experience: string
  rating: number
  image: string
}

interface DoctorLoginProps {
  onDoctorSelect: (doctor: Doctor) => void
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    experience: "12 years",
    rating: 4.9,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Neurology",
    experience: "10 years",
    rating: 4.7,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function DoctorLogin({ onDoctorSelect }: DoctorLoginProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl">Doctor Dashboard</CardTitle>
          <CardDescription>Select your profile to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => onDoctorSelect(doctor)}
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-2">{doctor.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {doctor.specialty}
                  </Badge>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{doctor.experience} experience</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Access Dashboard</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
