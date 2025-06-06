import SpecialtySelector from "@/components/specialty-selector"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Find and book appointments with qualified medical professionals</p>
        </div>

        <SpecialtySelector />
      </div>
    </div>
  )
}
