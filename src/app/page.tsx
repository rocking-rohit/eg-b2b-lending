'use client'

import { useAuth } from '@/contexts/AuthContext'
import RentalRequestForm from '@/components/RentalRequestForm'
import Link from 'next/link'

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-gray-900">🚗 CarLend</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
                  <Link
                    href="/bookings"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-150 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-150 font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-150 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <RentalRequestForm />
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CarLend?</h2>
            <p className="text-lg text-gray-600">Experience the future of car rental with our innovative platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from a variety of vehicles including sedans, SUVs, and luxury cars</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your vehicle in minutes with our streamlined process</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">All vehicles are verified and insured for your peace of mind</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
