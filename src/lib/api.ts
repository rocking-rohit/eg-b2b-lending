// API utility functions for client-side fetch calls

const API_BASE_URL = '/api'

// Enhanced User interface for car lending platform
export interface User {
  id: string
  email: string
  password?: string
  name?: string
  company?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  company_name?: string
  company_address?: string
  company_phone?: string
  tax_number?: string
  registration_date?: string
  user_type: 'borrower' | 'lender' | 'both'
  is_verified: boolean
  created_at: string
  updated_at: string
  vehicles?: Vehicle[]
  bookings?: Booking[]
}

// Vehicle interface
export interface Vehicle {
  id: string
  owner_id: string
  name: string
  license_plate: string
  size?: string
  transmission?: 'automatic' | 'manual'
  fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  kms_driven?: number
  free_kms?: number
  price_per_km_after?: number
  air_conditioning?: boolean
  number_of_seats?: number
  license_type_required?: string
  status: 'available' | 'booked' | 'maintenance' | 'unavailable'
  image_url?: string
  description?: string
  daily_rate: number
  created_at: string
  updated_at: string
  owner?: User
  bookings?: Booking[]
}

// Booking interface
export interface Booking {
  id: string
  user_id?: string
  vehicle_id: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  from_location: string
  to_location: string
  from_date: string
  to_date: string
  from_time: string
  to_time: string
  booking_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  total_price?: number
  estimated_distance?: number
  special_requirements?: string
  created_at: string
  updated_at: string
  user?: User
  vehicle?: Vehicle
  offers?: Offer[]
  payments?: Payment[]
  reviews?: Review[]
}

// Offer interface
export interface Offer {
  id: string
  booking_id: string
  offered_by_user_id: string
  offer_amount: number
  offer_status: 'pending' | 'accepted' | 'rejected' | 'countered'
  offer_date: string
  message?: string
  expires_at?: string
  created_at: string
  booking?: Booking
  offered_by_user?: User
  counteroffers?: Counteroffer[]
}

// Counteroffer interface
export interface Counteroffer {
  id: string
  offer_id: string
  countered_by_user_id: string
  counteroffer_amount: number
  counteroffer_status: 'pending' | 'accepted' | 'rejected'
  counteroffer_date: string
  message?: string
  expires_at?: string
  created_at: string
  offer?: Offer
  countered_by_user?: User
}

// Payment interface
export interface Payment {
  id: string
  booking_id: string
  payment_date: string
  amount_paid: number
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  created_at: string
  booking?: Booking
}

// Review interface
export interface Review {
  id: string
  booking_id: string
  user_id: string
  vehicle_id: string
  rating: number
  review_text?: string
  review_date: string
  created_at: string
  user?: User
  vehicle?: Vehicle
  booking?: Booking
}

// Notification interface
export interface Notification {
  id: string
  user_id: string
  message: string
  notification_type: string
  is_read: boolean
  related_entity_type?: string
  related_entity_id?: string
  created_at: string
  user?: User
}

// Legacy interfaces for backward compatibility
export interface LoanApplication {
  id: string
  user_id: string
  amount: number
  purpose: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  created_at: string
  updated_at: string
  user?: User
}

// User API functions
export const userApi = {
  // Get all users
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  },

  // Get user by ID
  async getById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  },

  // Create new user
  async create(userData: { 
    email: string
    name?: string
    company?: string
    first_name?: string
    last_name?: string
    phone_number?: string
    company_name?: string
    company_address?: string
    company_phone?: string
    user_type?: 'borrower' | 'lender' | 'both'
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    return response.json()
  },

  // Update user
  async update(id: string, userData: { 
    email?: string
    name?: string
    company?: string
    first_name?: string
    last_name?: string
    phone_number?: string
    company_name?: string
    company_address?: string
    company_phone?: string
    user_type?: 'borrower' | 'lender' | 'both'
    is_verified?: boolean
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    return response.json()
  },

  // Delete user
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete user')
    }
  }
}

// Vehicle API functions
export const vehicleApi = {
  // Get all vehicles
  async getAll(): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/vehicles`)
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
    owner_id: string
    name: string
    license_plate: string
    size?: string
    transmission?: 'automatic' | 'manual'
    fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    kms_driven?: number
    free_kms?: number
    price_per_km_after?: number
    air_conditioning?: boolean
    number_of_seats?: number
    license_type_required?: string
    status?: 'available' | 'booked' | 'maintenance' | 'unavailable'
    image_url?: string
    description?: string
    daily_rate: number
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
  async update(id: string, vehicleData: {
    name?: string
    license_plate?: string
    size?: string
    transmission?: 'automatic' | 'manual'
    fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    kms_driven?: number
    free_kms?: number
    price_per_km_after?: number
    air_conditioning?: boolean
    number_of_seats?: number
    license_type_required?: string
    status?: 'available' | 'booked' | 'maintenance' | 'unavailable'
    image_url?: string
    description?: string
    daily_rate?: number
  }): Promise<Vehicle> {
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

// Booking API functions
export const bookingApi = {
  // Get all bookings
  async getAll(): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`)
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
    user_id?: string
    vehicle_id: string
    guest_name?: string
    guest_email?: string
    guest_phone?: string
    from_location: string
    to_location: string
    from_date: string
    to_date: string
    from_time: string
    to_time: string
    booking_status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    total_price?: number
    estimated_distance?: number
    special_requirements?: string
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
  async update(id: string, bookingData: {
    from_location?: string
    to_location?: string
    from_date?: string
    to_date?: string
    from_time?: string
    to_time?: string
    booking_status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    total_price?: number
    estimated_distance?: number
    special_requirements?: string
  }): Promise<Booking> {
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

  // Cancel booking (soft delete)
  async cancel(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to cancel booking')
    }
  }
}

// Loan API functions
export const loanApi = {
  // Get all loan applications
  async getAll(): Promise<LoanApplication[]> {
    const response = await fetch(`${API_BASE_URL}/loans`)
    if (!response.ok) {
      throw new Error('Failed to fetch loans')
    }
    return response.json()
  },

  // Get loan by ID
  async getById(id: string): Promise<LoanApplication> {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch loan')
    }
    return response.json()
  },

  // Create new loan application
  async create(loanData: { user_id: string; amount: number; purpose: string }): Promise<LoanApplication> {
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
    })
    if (!response.ok) {
      throw new Error('Failed to create loan application')
    }
    return response.json()
  },

  // Update loan application
  async update(id: string, loanData: { amount?: number; purpose?: string; status?: string }): Promise<LoanApplication> {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
    })
    if (!response.ok) {
      throw new Error('Failed to update loan application')
    }
    return response.json()
  },

  // Delete loan application
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete loan application')
    }
  }
}
