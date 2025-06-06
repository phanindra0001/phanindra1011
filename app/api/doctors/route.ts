import { NextResponse } from "next/server"

// Mock data for doctors
const doctors = [
  // Cardiology
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialtyId: 1,
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.8,
    availability: "Mon-Fri 9AM-5PM",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialtyId: 1,
    specialty: "Cardiology",
    experience: "12 years",
    rating: 4.9,
    availability: "Tue-Sat 10AM-6PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Dermatology
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialtyId: 2,
    specialty: "Dermatology",
    experience: "10 years",
    rating: 4.7,
    availability: "Mon-Wed-Fri 8AM-4PM",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialtyId: 2,
    specialty: "Dermatology",
    experience: "18 years",
    rating: 4.6,
    availability: "Mon-Thu 9AM-5PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Endocrinology
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialtyId: 3,
    specialty: "Endocrinology",
    experience: "14 years",
    rating: 4.8,
    availability: "Tue-Thu 9AM-3PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Gastroenterology
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialtyId: 4,
    specialty: "Gastroenterology",
    experience: "16 years",
    rating: 4.9,
    availability: "Mon-Fri 8AM-4PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Neurology
  {
    id: 7,
    name: "Dr. Amanda Davis",
    specialtyId: 5,
    specialty: "Neurology",
    experience: "13 years",
    rating: 4.7,
    availability: "Wed-Fri 10AM-6PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Orthopedics
  {
    id: 8,
    name: "Dr. David Martinez",
    specialtyId: 6,
    specialty: "Orthopedics",
    experience: "20 years",
    rating: 4.8,
    availability: "Mon-Fri 7AM-3PM",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 9,
    name: "Dr. Jennifer Lee",
    specialtyId: 6,
    specialty: "Orthopedics",
    experience: "11 years",
    rating: 4.6,
    availability: "Tue-Sat 9AM-5PM",
    image: "/placeholder.svg?height=100&width=100",
  },

  // Pediatrics
  {
    id: 10,
    name: "Dr. Christopher Brown",
    specialtyId: 7,
    specialty: "Pediatrics",
    experience: "17 years",
    rating: 4.9,
    availability: "Mon-Fri 8AM-6PM",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialtyId = searchParams.get("specialtyId")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredDoctors = doctors

    if (specialtyId) {
      const specialtyIdNum = Number.parseInt(specialtyId)
      filteredDoctors = doctors.filter((doctor) => doctor.specialtyId === specialtyIdNum)
    }

    return NextResponse.json({
      success: true,
      data: filteredDoctors,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch doctors" }, { status: 500 })
  }
}
