"use client"

import { useState } from "react"
import DoctorLogin from "@/components/doctor-login"
import DoctorDashboard from "@/components/doctor-dashboard"

interface Doctor {
  id: number
  name: string
  specialty: string
  experience: string
  rating: number
  image: string
}

export default function DoctorDashboardPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleLogout = () => {
    setSelectedDoctor(null)
  }

  if (!selectedDoctor) {
    return <DoctorLogin onDoctorSelect={handleDoctorSelect} />
  }

  return (
    <div>
      <div className="bg-white border-b px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
            Switch Doctor
          </button>
        </div>
      </div>
      <DoctorDashboard
        doctorId={selectedDoctor.id}
        doctorName={selectedDoctor.name}
        doctorSpecialty={selectedDoctor.specialty}
      />
    </div>
  )
}
