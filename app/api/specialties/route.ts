import { NextResponse } from "next/server"

// Mock data for medical specialties
const specialties = [
  { id: 1, name: "Cardiology", description: "Heart and cardiovascular system" },
  { id: 2, name: "Dermatology", description: "Skin, hair, and nail conditions" },
  { id: 3, name: "Endocrinology", description: "Hormones and metabolism" },
  { id: 4, name: "Gastroenterology", description: "Digestive system" },
  { id: 5, name: "Neurology", description: "Brain and nervous system" },
  { id: 6, name: "Orthopedics", description: "Bones, joints, and muscles" },
  { id: 7, name: "Pediatrics", description: "Children's health" },
  { id: 8, name: "Psychiatry", description: "Mental health" },
  { id: 9, name: "Radiology", description: "Medical imaging" },
  { id: 10, name: "Urology", description: "Urinary system" },
]

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: specialties,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch specialties" }, { status: 500 })
  }
}
