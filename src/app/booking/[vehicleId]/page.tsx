'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { vehicleApi, Vehicle, bookingApi, Booking } from '@/lib/api'

// Step indicator component
const StepIndicator = memo(({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center space-x-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            index + 1 <= currentStep
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  </div>
))

StepIndicator.displayName = 'StepIndicator'

// Booking summary component
const BookingSummary = memo(({ 
  vehicle, 
  rentalData 
}: { 
  vehicle: Vehicle
  rentalData: {
    pickupLocation: string
    deliveryLocation: string
    pickupDate: string
    pickupTime: string
    deliveryDate: string
    deliveryTime: string
    specialRequirements: string
  }
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Vehicle Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle:</span>
            <span className="font-medium">{vehicle.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">License Plate:</span>
            <span className="font-medium">{vehicle.license_plate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{vehicle.transmission || 'N/A'} • {vehicle.fuel_type || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats:</span>
            <span className="font-medium">{vehicle.number_of_seats || 0} seats</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Rate:</span>
            <span className="font-medium text-blue-600">₹{vehicle.daily_rate}</span>
          </div>
        </div>
      </div>

      {/* Rental Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup:</span>
            <span className="font-medium">{rentalData.pickupLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drop Off:</span>
            <span className="font-medium">{rentalData.deliveryLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup Date:</span>
            <span className="font-medium">{new Date(rentalData.pickupDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup Time:</span>
            <span className="font-medium">{rentalData.pickupTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Return Date:</span>
            <span className="font-medium">{new Date(rentalData.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Return Time:</span>
            <span className="font-medium">{rentalData.deliveryTime}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Special Requirements */}
    {rentalData.specialRequirements && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h3>
        <p className="text-gray-600">{rentalData.specialRequirements}</p>
      </div>
    )}

    {/* Price Calculation */}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-900">Total Amount</span>
        <span className="text-2xl font-bold text-blue-600">₹{vehicle.daily_rate}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">* Final amount may vary based on distance and additional services</p>
    </div>
  </div>
))

BookingSummary.displayName = 'BookingSummary'

// Counter offer form component
const CounterOfferForm = memo(({ 
  onSubmit, 
  onCancel, 
  isLoading 
}: { 
  onSubmit: (amount: number, message: string) => void
  onCancel: () => void
  isLoading: boolean
}) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount && parseFloat(amount) > 0) {
      onSubmit(parseFloat(amount), message)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Make a Counter Offer</h3>
      <p className="text-gray-600 mb-6">Suggest your preferred price for this booking. The owner will review and respond within 2-3 business days.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Your Offer Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter your offer amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message to explain your offer..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !amount}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-150 ${
              isLoading || !amount
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Counter Offer'}
          </button>
        </div>
      </form>
    </div>
  )
})

CounterOfferForm.displayName = 'CounterOfferForm'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.vehicleId as string
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [rentalData, setRentalData] = useState<{
    pickupLocation: string
    deliveryLocation: string
    pickupDate: string
    pickupTime: string
    deliveryDate: string
    deliveryTime: string
    specialRequirements: string
  } | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCounterOffer, setShowCounterOffer] = useState(false)

  const totalSteps = 4

  useEffect(() => {
    // Get rental data from session storage
    const storedData = sessionStorage.getItem('bookingData')
    if (storedData) {
      setRentalData(JSON.parse(storedData))
    } else {
      setError('No booking data found. Please start over.')
      return
    }

    // Fetch vehicle details
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const vehicleData = await vehicleApi.getById(vehicleId)
        setVehicle(vehicleData)
      } catch (err) {
        setError('Failed to load vehicle details')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [vehicleId])

  const handleAcceptBooking = useCallback(async () => {
    if (!vehicle || !rentalData) return

    try {
      setIsSubmitting(true)
      
      // Create booking as guest (no user_id)
      const bookingData = {
        vehicle_id: vehicleId,
        guest_name: 'Guest User', // We'll implement proper user management later
        guest_email: 'guest@example.com',
        guest_phone: '+1-555-0000',
        from_location: rentalData.pickupLocation,
        to_location: rentalData.deliveryLocation,
        from_date: rentalData.pickupDate,
        to_date: rentalData.deliveryDate,
        from_time: rentalData.pickupTime,
        to_time: rentalData.deliveryTime,
        booking_status: 'confirmed' as const,
        total_price: vehicle.daily_rate,
        special_requirements: rentalData.specialRequirements
      }

      const booking = await bookingApi.create(bookingData)
      
      // Move to next step
      setCurrentStep(2)
      
      // Store booking ID for later steps
      sessionStorage.setItem('currentBookingId', booking.id)
      
    } catch (err) {
      setError('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [vehicle, rentalData, vehicleId])

  const handleCounterOffer = useCallback(async (amount: number, message: string) => {
    if (!vehicle || !rentalData) return

    try {
      setIsSubmitting(true)
      
      // Create booking with pending status as guest
      const bookingData = {
        vehicle_id: vehicleId,
        guest_name: 'Guest User', // We'll implement proper user management later
        guest_email: 'guest@example.com',
        guest_phone: '+1-555-0000',
        from_location: rentalData.pickupLocation,
        to_location: rentalData.deliveryLocation,
        from_date: rentalData.pickupDate,
        to_date: rentalData.deliveryDate,
        from_time: rentalData.pickupTime,
        to_time: rentalData.deliveryTime,
        booking_status: 'pending' as const,
        total_price: amount,
        special_requirements: rentalData.specialRequirements
      }

      const booking = await bookingApi.create(bookingData)
      
      // Store booking ID and move to waiting step
      sessionStorage.setItem('currentBookingId', booking.id)
      setCurrentStep(3)
      
    } catch (err) {
      setError('Failed to submit counter offer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [vehicle, rentalData, vehicleId])

  const handleProceedToDocuments = useCallback(() => {
    setCurrentStep(4)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle || !rentalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Missing booking data'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/vehicles')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step 1: Booking Summary and Options */}
        {currentStep === 1 && (
          <div>
            <BookingSummary vehicle={vehicle} rentalData={rentalData} />
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Next Step</h3>
              <p className="text-gray-600 mb-6">Review the details above and choose how you'd like to proceed.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAcceptBooking}
                  disabled={isSubmitting}
                  className={`flex-1 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Accept & Book Now'}
                </button>
                
                <button
                  onClick={() => setShowCounterOffer(true)}
                  disabled={isSubmitting}
                  className={`flex-1 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  Make Counter Offer
                </button>
              </div>
            </div>

            {/* Counter Offer Form */}
            {showCounterOffer && (
              <div className="mt-6">
                <CounterOfferForm
                  onSubmit={handleCounterOffer}
                  onCancel={() => setShowCounterOffer(false)}
                  isLoading={isSubmitting}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Booking Confirmed */}
        {currentStep === 2 && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your booking has been successfully created. You can now proceed to complete the final steps.
              </p>
              <button
                onClick={handleProceedToDocuments}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-150"
              >
                Proceed to Document Signing
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Counter Offer Submitted */}
        {currentStep === 3 && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-blue-500 text-6xl mb-4">⏳</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter Offer Submitted</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your counter offer has been submitted successfully. The vehicle owner will review your offer and respond within 2-3 business days.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>What happens next?</strong><br />
                  • You&apos;ll receive an email notification when the owner responds<br />
                  • If accepted, you&apos;ll be redirected to complete the booking<br />
                  • If declined, you can make another offer or choose a different vehicle
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-150"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Document Signing */}
        {currentStep === 4 && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-blue-500 text-6xl mb-4">📝</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Document Signing</h2>
              <p className="text-lg text-gray-600 mb-6">
                Please review and sign the rental agreement to complete your booking.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Rental Agreement</h3>
                <p className="text-sm text-gray-600 mb-2">
                  By signing this agreement, you agree to the terms and conditions of the vehicle rental.
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  • Vehicle must be returned in the same condition as received<br />
                  • Any damages will be charged to your account<br />
                  • Fuel costs are the responsibility of the renter<br />
                  • Insurance coverage is included in the rental price
                </p>
              </div>
              <button
                onClick={() => {
                  // Simulate document signing
                  setTimeout(() => {
                    setCurrentStep(5)
                  }, 2000)
                }}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-150"
              >
                Sign Document
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-green-500 text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Congratulations! Your vehicle rental has been successfully booked and all documents have been signed.
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  <strong>Next Steps:</strong><br />
                  • You&apos;ll receive a confirmation email with all details<br />
                  • Contact information for vehicle pickup will be provided<br />
                  • Remember to bring a valid driver&apos;s license for pickup
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-150"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => router.push('/bookings')}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-150"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
