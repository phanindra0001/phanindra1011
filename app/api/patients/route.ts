import { NextResponse } from "next/server"

// Mock patient data with detailed history
const patients = [
  {
    id: "PAT001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568",
    },
    medicalInfo: {
      bloodType: "O+",
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: ["Hypertension"],
      currentMedications: ["Lisinopril 10mg", "Aspirin 81mg"],
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001",
    },
    appointments: [
      {
        id: "APT001",
        date: "2024-01-15",
        time: "9:00 AM",
        reason: "Regular checkup",
        status: "confirmed",
        type: "consultation",
        notes: "Patient reports feeling well. Blood pressure slightly elevated.",
        diagnosis: "Hypertension - well controlled",
        treatment: "Continue current medication",
        followUp: "3 months",
      },
      {
        id: "APT007",
        date: "2023-10-15",
        time: "10:00 AM",
        reason: "Follow-up for hypertension",
        status: "completed",
        type: "follow-up",
        notes: "Blood pressure improved. Patient compliant with medication.",
        diagnosis: "Hypertension - improving",
        treatment: "Continue Lisinopril, add low-dose aspirin",
        followUp: "3 months",
      },
      {
        id: "APT008",
        date: "2023-07-20",
        time: "2:30 PM",
        reason: "Initial consultation for chest pain",
        status: "completed",
        type: "consultation",
        notes: "Patient presented with chest discomfort. EKG normal. Stress test recommended.",
        diagnosis: "Atypical chest pain",
        treatment: "Lifestyle modifications, stress test ordered",
        followUp: "2 weeks",
      },
    ],
  },
  {
    id: "PAT002",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 987-6543",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Brother",
      phone: "+1 (555) 987-6544",
    },
    medicalInfo: {
      bloodType: "A-",
      allergies: ["Latex"],
      chronicConditions: [],
      currentMedications: ["Multivitamin"],
    },
    insurance: {
      provider: "Aetna",
      policyNumber: "AET987654321",
      groupNumber: "GRP002",
    },
    appointments: [
      {
        id: "APT002",
        date: "2024-01-15",
        time: "10:30 AM",
        reason: "Follow-up appointment",
        status: "confirmed",
        type: "follow-up",
        notes: "Routine follow-up. Patient doing well.",
        diagnosis: "Healthy",
        treatment: "Continue current lifestyle",
        followUp: "1 year",
      },
      {
        id: "APT009",
        date: "2023-01-15",
        time: "11:00 AM",
        reason: "Annual physical",
        status: "completed",
        type: "consultation",
        notes: "Complete physical examination. All vitals normal. Lab work ordered.",
        diagnosis: "Healthy adult",
        treatment: "Continue healthy lifestyle",
        followUp: "1 year",
      },
    ],
  },
  {
    id: "PAT003",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "1978-11-08",
    gender: "Male",
    address: "789 Pine St, Queens, NY 11375",
    emergencyContact: {
      name: "Lisa Brown",
      relationship: "Wife",
      phone: "+1 (555) 456-7891",
    },
    medicalInfo: {
      bloodType: "B+",
      allergies: ["Sulfa drugs"],
      chronicConditions: ["Type 2 Diabetes", "High Cholesterol"],
      currentMedications: ["Metformin 500mg", "Atorvastatin 20mg"],
    },
    insurance: {
      provider: "UnitedHealthcare",
      policyNumber: "UHC456789123",
      groupNumber: "GRP003",
    },
    appointments: [
      {
        id: "APT003",
        date: "2024-01-16",
        time: "2:00 PM",
        reason: "Chest pain evaluation",
        status: "pending",
        type: "consultation",
        notes: "",
        diagnosis: "",
        treatment: "",
        followUp: "",
      },
      {
        id: "APT010",
        date: "2023-12-10",
        time: "9:30 AM",
        reason: "Diabetes management",
        status: "completed",
        type: "follow-up",
        notes: "HbA1c improved to 7.2%. Patient reports better glucose control.",
        diagnosis: "Type 2 Diabetes - well controlled",
        treatment: "Continue Metformin, dietary counseling",
        followUp: "3 months",
      },
    ],
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const patientId = searchParams.get("patientId")
    const search = searchParams.get("search")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredPatients = patients

    if (patientId) {
      filteredPatients = patients.filter((patient) => patient.id === patientId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPatients = filteredPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phone.includes(search),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredPatients,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch patients" }, { status: 500 })
  }
}
