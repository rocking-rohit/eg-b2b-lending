'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface RentalRequest {
  pickupLocation: string
  deliveryLocation: string
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  specialRequirements?: string
}

export default function RentalRequestForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<RentalRequest>({
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    specialRequirements: ''
  })
  const [errors, setErrors] = useState<Partial<RentalRequest>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((field: keyof RentalRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }, [errors])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<RentalRequest> = {}

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required'
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Delivery location is required'
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required'
    } else {
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
      const now = new Date()
      if (pickupDateTime <= now) {
        newErrors.pickupDate = 'Pickup date must be in the future'
      }
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required'
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required'
    } else {
      const deliveryDateTime = new Date(`${formData.deliveryDate}T${formData.deliveryTime}`)
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
      if (deliveryDateTime <= pickupDateTime) {
        newErrors.deliveryDate = 'Delivery date must be after pickup date'
      }
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Delivery time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create query parameters
      const queryParams = new URLSearchParams({
        pickupLocation: formData.pickupLocation,
        deliveryLocation: formData.deliveryLocation,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        ...(formData.specialRequirements && { specialRequirements: formData.specialRequirements })
      })

      // Redirect to vehicles page with query parameters
      router.push(`/vehicles?${queryParams.toString()}`)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, router])

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚗 Find Your Perfect Vehicle</h1>
          <p className="text-gray-600">Tell us about your rental needs and we'll find the best vehicles for you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location *
            </label>
            <input
              type="text"
              id="pickupLocation"
              value={formData.pickupLocation}
              onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
              placeholder="Enter pickup address or landmark"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pickupLocation && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
            )}
          </div>

          {/* Delivery Location */}
          <div>
            <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Drop Off Location *
            </label>
            <input
              type="text"
              id="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
              placeholder="Enter delivery address or landmark"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                errors.deliveryLocation ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deliveryLocation && (
              <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation}</p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Date */}
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date *
              </label>
              <input
                type="date"
                id="pickupDate"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                  errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>
              )}
            </div>

            {/* Pickup Time */}
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Time *
              </label>
              <input
                type="time"
                id="pickupTime"
                value={formData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                  errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupTime && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupTime}</p>
              )}
            </div>
          </div>

          {/* Delivery Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Date */}
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Date *
              </label>
              <input
                type="date"
                id="deliveryDate"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                min={formData.pickupDate || today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                  errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deliveryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>
              )}
            </div>

            {/* Delivery Time */}
            <div>
              <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time *
              </label>
              <input
                type="time"
                id="deliveryTime"
                value={formData.deliveryTime}
                onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${
                  errors.deliveryTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deliveryTime && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
              )}
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements (Optional)
            </label>
            <textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="Any special requirements, preferences, or notes..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Finding Vehicles...
                </div>
              ) : (
                'Find Available Vehicles'
              )}
            </button>
          </div>
        </form>

        {/* Quick Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How it works</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>1. Fill in your rental details above</p>
                <p>2. Browse available vehicles that match your needs</p>
                <p>3. Compare prices and features</p>
                <p>4. Book your preferred vehicle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
