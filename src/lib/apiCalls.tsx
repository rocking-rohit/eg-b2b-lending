// Frontend API calls for Car Lending Platform
import { 
  User, 
  Vehicle, 
  Booking, 
  Offer, 
  Counteroffer, 
  Payment, 
  Review, 
  Notification 
} from './api'

const API_BASE_URL = '/api'

// Vehicle API calls
export const vehicleApi = {
  // Get all vehicles with optional filters
  async getAll(filters?: {
    status?: string
    fuelType?: string
    transmission?: string
    minPrice?: number
    maxPrice?: number
    location?: string
  }): Promise<Vehicle[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `${API_BASE_URL}/vehicles${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles')
    }
    return response.json()
  },

  // Get vehicle by ID
  async getById(id: string): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle')
    }
    return response.json()
  },

  // Create new vehicle
  async create(vehicleData: {
    ownerId: string
    name: string
    licensePlate: string
    size?: string
    transmission?: 'automatic' | 'manual'
    fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    kmsDriven?: number
    freeKms?: number
    pricePerKmAfter?: number
    airConditioning?: boolean
    numberOfSeats?: number
    licenseTypeRequired?: string
    status?: 'available' | 'booked' | 'maintenance' | 'unavailable'
    imageUrl?: string
    description?: string
    dailyRate: number
  }): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    })
    if (!response.ok) {
      throw new Error('Failed to create vehicle')
    }
    return response.json()
  },

  // Update vehicle
  async update(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    })
    if (!response.ok) {
      throw new Error('Failed to update vehicle')
    }
    return response.json()
  },

  // Delete vehicle
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete vehicle')
    }
  }
}

// Booking API calls
export const bookingApi = {
  // Get all bookings with optional filters
  async getAll(filters?: {
    userId?: string
    vehicleId?: string
    status?: string
    fromDate?: string
    toDate?: string
  }): Promise<Booking[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `${API_BASE_URL}/bookings${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }
    return response.json()
  },

  // Get booking by ID
  async getById(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch booking')
    }
    return response.json()
  },

  // Create new booking
  async create(bookingData: {
    userId?: string
    vehicleId: string
    guestName?: string
    guestEmail?: string
    guestPhone?: string
    fromLocation: string
    toLocation: string
    fromDate: string
    toDate: string
    fromTime: string
    toTime: string
    totalPrice?: number
    estimatedDistance?: number
    specialRequirements?: string
  }): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) {
      throw new Error('Failed to create booking')
    }
    return response.json()
  },

  // Update booking
  async update(id: string, bookingData: Partial<Booking>): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) {
      throw new Error('Failed to update booking')
    }
    return response.json()
  },

  // Cancel booking
  async cancel(id: string): Promise<{ message: string; booking: Booking }> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to cancel booking')
    }
    return response.json()
  }
}

// Offer API calls
export const offerApi = {
  // Get all offers with optional filters
  async getAll(filters?: {
    bookingId?: string
    offeredByUserId?: string
    status?: string
  }): Promise<Offer[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `${API_BASE_URL}/offers${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch offers')
    }
    return response.json()
  },

  // Get offer by ID
  async getById(id: string): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch offer')
    }
    return response.json()
  },

  // Create new offer
  async create(offerData: {
    bookingId: string
    offeredByUserId: string
    offerAmount: number
    message?: string
    expiresAt?: string
  }): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerData),
    })
    if (!response.ok) {
      throw new Error('Failed to create offer')
    }
    return response.json()
  },

  // Update offer status
  async updateStatus(id: string, status: string, message?: string): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ offerStatus: status, message }),
    })
    if (!response.ok) {
      throw new Error('Failed to update offer')
    }
    return response.json()
  },

  // Delete offer
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete offer')
    }
  }
}

// Counteroffer API calls
export const counterofferApi = {
  // Get all counteroffers with optional filters
  async getAll(filters?: {
    offerId?: string
    counteredByUserId?: string
    status?: string
  }): Promise<Counteroffer[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `${API_BASE_URL}/counteroffers${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch counteroffers')
    }
    return response.json()
  },

  // Get counteroffer by ID
  async getById(id: string): Promise<Counteroffer> {
    const response = await fetch(`${API_BASE_URL}/counteroffers/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch counteroffer')
    }
    return response.json()
  },

  // Create new counteroffer
  async create(counterofferData: {
    offerId: string
    counteredByUserId: string
    counterofferAmount: number
    message?: string
    expiresAt?: string
  }): Promise<Counteroffer> {
    const response = await fetch(`${API_BASE_URL}/counteroffers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(counterofferData),
    })
    if (!response.ok) {
      throw new Error('Failed to create counteroffer')
    }
    return response.json()
  },

  // Update counteroffer status
  async updateStatus(id: string, status: string, message?: string): Promise<Counteroffer> {
    const response = await fetch(`${API_BASE_URL}/counteroffers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ counterofferStatus: status, message }),
    })
    if (!response.ok) {
      throw new Error('Failed to update counteroffer')
    }
    return response.json()
  },

  // Delete counteroffer
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/counteroffers/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete counteroffer')
    }
  }
}

// Payment API calls (placeholder for future implementation)
export const paymentApi = {
  // Process payment
  async processPayment(paymentData: {
    bookingId: string
    amount: number
    paymentMethod: string
    transactionId?: string
  }): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
    if (!response.ok) {
      throw new Error('Failed to process payment')
    }
    return response.json()
  },

  // Get payment by ID
  async getById(id: string): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch payment')
    }
    return response.json()
  }
}

// Review API calls (placeholder for future implementation)
export const reviewApi = {
  // Create review
  async create(reviewData: {
    bookingId: string
    userId: string
    vehicleId: string
    rating: number
    reviewText?: string
  }): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })
    if (!response.ok) {
      throw new Error('Failed to create review')
    }
    return response.json()
  },

  // Get reviews by vehicle ID
  async getByVehicleId(vehicleId: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews?vehicleId=${vehicleId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }
    return response.json()
  }
}

// Notification API calls (placeholder for future implementation)
export const notificationApi = {
  // Get notifications for user
  async getByUserId(userId: string): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }
    return response.json()
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRead: true }),
    })
    if (!response.ok) {
      throw new Error('Failed to mark notification as read')
    }
    return response.json()
  }
}
