import { NextResponse } from "next/server"

// Mock appointments data
const appointments = [
  {
    id: "APT001",
    doctorId: 1,
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    patientPhone: "+1 (555) 123-4567",
    date: "2024-01-15",
    time: "9:00 AM",
    reason: "Regular checkup",
    status: "confirmed",
    type: "consultation",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "APT002",
    doctorId: 1,
    patientName: "Sarah Johnson",
    patientEmail: "sarah.j@email.com",
    patientPhone: "+1 (555) 987-6543",
    date: "2024-01-15",
    time: "10:30 AM",
    reason: "Follow-up appointment",
    status: "confirmed",
    type: "follow-up",
    createdAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "APT003",
    doctorId: 1,
    patientName: "Michael Brown",
    patientEmail: "m.brown@email.com",
    patientPhone: "+1 (555) 456-7890",
    date: "2024-01-16",
    time: "2:00 PM",
    reason: "Chest pain evaluation",
    status: "pending",
    type: "consultation",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "APT004",
    doctorId: 1,
    patientName: "Emily Davis",
    patientEmail: "emily.davis@email.com",
    patientPhone: "+1 (555) 321-0987",
    date: "2024-01-17",
    time: "11:00 AM",
    reason: "Medication review",
    status: "confirmed",
    type: "consultation",
    createdAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "APT005",
    doctorId: 1,
    patientName: "Robert Wilson",
    patientEmail: "r.wilson@email.com",
    patientPhone: "+1 (555) 654-3210",
    date: "2024-01-12",
    time: "3:30 PM",
    reason: "Post-surgery checkup",
    status: "completed",
    type: "follow-up",
    createdAt: "2024-01-08T11:20:00Z",
  },
  {
    id: "APT006",
    doctorId: 2,
    patientName: "Lisa Anderson",
    patientEmail: "lisa.a@email.com",
    patientPhone: "+1 (555) 789-0123",
    date: "2024-01-15",
    time: "9:30 AM",
    reason: "Skin examination",
    status: "confirmed",
    type: "consultation",
    createdAt: "2024-01-11T13:00:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const status = searchParams.get("status")
    const date = searchParams.get("date")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredAppointments = appointments

    if (doctorId) {
      const doctorIdNum = Number.parseInt(doctorId)
      filteredAppointments = filteredAppointments.filter((apt) => apt.doctorId === doctorIdNum)
    }

    if (status) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.status === status)
    }

    if (date) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.date === date)
    }

    return NextResponse.json({
      success: true,
      data: filteredAppointments,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, status, date, time } = body

    // Simulate updating appointment
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update appointment" }, { status: 500 })
  }
}
