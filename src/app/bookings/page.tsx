'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { bookingApi, Booking } from '@/lib/api'

// Booking card component
const BookingCard = memo(({ 
  booking, 
  onViewDetails 
}: { 
  booking: Booking
  onViewDetails: (bookingId: string) => void
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {booking.vehicle?.name || 'Vehicle Name Not Available'}
        </h3>
        <p className="text-sm text-gray-500">
          Booking ID: {booking.id.slice(0, 8)}...
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        booking.booking_status === 'confirmed' 
          ? 'bg-green-100 text-green-800'
          : booking.booking_status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : booking.booking_status === 'in_progress'
          ? 'bg-blue-100 text-blue-800'
          : booking.booking_status === 'completed'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {booking.booking_status.replace('_', ' ').toUpperCase()}
      </span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Pickup Location</p>
        <p className="font-medium">{booking.from_location}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Drop Off Location</p>
        <p className="font-medium">{booking.to_location}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Pickup Date & Time</p>
        <p className="font-medium">
          {new Date(booking.from_date).toLocaleDateString()} at {booking.from_time}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Return Date & Time</p>
        <p className="font-medium">
          {new Date(booking.to_date).toLocaleDateString()} at {booking.to_time}
        </p>
      </div>
    </div>
    
    {booking.total_price && (
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Total Amount</span>
        <span className="text-lg font-semibold text-blue-600">₹{booking.total_price}</span>
      </div>
    )}
    
    {booking.special_requirements && (
      <div className="mb-4">
        <p className="text-sm text-gray-600">Special Requirements</p>
        <p className="text-sm text-gray-800">{booking.special_requirements}</p>
      </div>
    )}
    
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">
        Created: {new Date(booking.created_at).toLocaleDateString()}
      </span>
      <button
        onClick={() => onViewDetails(booking.id)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>
    </div>
  </div>
))

BookingCard.displayName = 'BookingCard'

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingApi.getAll()
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleViewDetails = useCallback((bookingId: string) => {
    // Navigate to booking details page
    router.push(`/booking-details/${bookingId}`)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Try Again
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
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Book New Vehicle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t made any bookings yet. Start by finding a vehicle to rent!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Find a Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
