'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { vehicleApi, Vehicle } from '@/lib/api'

// Memoized VehicleCard component
const VehicleCard = memo(({ 
  vehicle, 
  onBook 
}: { 
  vehicle: Vehicle
  onBook: (vehicleId: string) => void
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="h-48 bg-gray-200 relative">
      {vehicle.image_url ? (
        <img 
          src={vehicle.image_url} 
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
          <span className="text-6xl">🚗</span>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          vehicle.status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {vehicle.status === 'available' ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">₹{vehicle.daily_rate}</div>
          <div className="text-sm text-gray-500">per day</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p className="mb-1">📋 {vehicle.license_plate}</p>
        <p className="mb-1">⚙️ {vehicle.transmission || 'N/A'} • {vehicle.fuel_type || 'N/A'}</p>
        <p className="mb-1">👥 {vehicle.number_of_seats || 0} seats • {vehicle.size || 'N/A'}</p>
        <p className="mb-1">🛣️ {(vehicle.kms_driven || 0).toLocaleString()} km driven</p>
        {vehicle.air_conditioning && <p className="mb-1">❄️ Air Conditioning</p>}
      </div>
      
      {vehicle.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>Free: {vehicle.free_kms || 0} km</p>
          <p>After: ₹{vehicle.price_per_km_after || 0}/km</p>
        </div>
        <button
          onClick={() => onBook(vehicle.id)}
          disabled={vehicle.status !== 'available'}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            vehicle.status === 'available'
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {vehicle.status === 'available' ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  </div>
))

VehicleCard.displayName = 'VehicleCard'

// Rental Summary Component
const RentalSummary = memo(({ 
  rentalData 
}: { 
  rentalData: {
    pickupLocation: string
    deliveryLocation: string
    pickupDate: string
    pickupTime: string
    deliveryDate: string
    deliveryTime: string
    specialRequirements?: string
  }
}) => (
  <div className="bg-blue-50 rounded-lg p-6 mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rental Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium text-gray-700">Pickup:</span>
        <p className="text-gray-600">{rentalData.pickupLocation}</p>
        <p className="text-gray-600">{new Date(rentalData.pickupDate).toLocaleDateString()} at {rentalData.pickupTime}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Delivery:</span>
        <p className="text-gray-600">{rentalData.deliveryLocation}</p>
        <p className="text-gray-600">{new Date(rentalData.deliveryDate).toLocaleDateString()} at {rentalData.deliveryTime}</p>
      </div>
      {rentalData.specialRequirements && (
        <div className="md:col-span-2">
          <span className="font-medium text-gray-700">Special Requirements:</span>
          <p className="text-gray-600">{rentalData.specialRequirements}</p>
        </div>
      )}
    </div>
  </div>
))

RentalSummary.displayName = 'RentalSummary'

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    transmission: '',
    fuelType: '',
    size: '',
    maxPrice: ''
  })

  // Extract rental data from query parameters
  const rentalData = {
    pickupLocation: searchParams.get('pickupLocation') || '',
    deliveryLocation: searchParams.get('deliveryLocation') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    pickupTime: searchParams.get('pickupTime') || '',
    deliveryDate: searchParams.get('deliveryDate') || '',
    deliveryTime: searchParams.get('deliveryTime') || '',
    specialRequirements: searchParams.get('specialRequirements') || ''
  }

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vehicleApi.getAll()
      setVehicles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleBookVehicle = useCallback((vehicleId: string) => {
    // Create booking data with rental details
    const bookingData = {
      vehicleId,
      ...rentalData
    }
    
    // Store booking data in sessionStorage for the booking form
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData))
    
    // Redirect to booking page
    router.push(`/booking/${vehicleId}`)
  }, [rentalData, router])

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false
    if (filters.fuelType && vehicle.fuel_type !== filters.fuelType) return false
    if (filters.size && vehicle.size !== filters.size) return false
    if (filters.maxPrice && vehicle.daily_rate > parseInt(filters.maxPrice)) return false
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available vehicles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Vehicles</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchVehicles}
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
              <h1 className="text-2xl font-bold text-gray-900">🚗 Available Vehicles</h1>
            </div>
            <div className="text-sm text-gray-600">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Rental Summary */}
        <RentalSummary rentalData={rentalData} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="XL">XL</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹/day)</label>
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No limit</option>
                <option value="1000">Under ₹1,000</option>
                <option value="2000">Under ₹2,000</option>
                <option value="3000">Under ₹3,000</option>
                <option value="5000">Under ₹5,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={handleBookVehicle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later</p>
            <button
              onClick={() => setFilters({ transmission: '', fuelType: '', size: '', maxPrice: '' })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
