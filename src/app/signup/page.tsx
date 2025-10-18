'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showNotification, setShowNotification] = useState(false)

  // Clear field error when user starts typing
  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      }
      return prev
    })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("========= FORM SUBMISSION =========")
    console.log("email:", email)
    console.log("password:", password)
    console.log("confirmPassword:", confirmPassword)
    console.log("firstName:", firstName)
    console.log("lastName:", lastName)
    console.log("companyName:", companyName)
    console.log("contactNumber:", contactNumber)
    console.log("taxNumber:", taxNumber)
    console.log("===================================")

    // Clear previous errors
    setError(null)
    setFieldErrors({})
    
    // Validation
    const newFieldErrors: Record<string, string> = {}
    
    if (!email.trim()) {
      newFieldErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newFieldErrors.email = 'Please enter a valid email address'
    }
    
    if (!password.trim()) {
      newFieldErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!confirmPassword.trim()) {
      newFieldErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!firstName.trim()) {
      newFieldErrors.firstName = 'First name is required'
    }
    
    if (!lastName.trim()) {
      newFieldErrors.lastName = 'Last name is required'
    }
    
    if (!companyName.trim()) {
      newFieldErrors.companyName = 'Company name is required'
    }
    
    if (!contactNumber.trim()) {
      newFieldErrors.contactNumber = 'Contact number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(contactNumber)) {
      newFieldErrors.contactNumber = 'Please enter a valid contact number'
    }
    
    if (!taxNumber.trim()) {
      newFieldErrors.taxNumber = 'Tax number is required'
    }
    
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store user data in session storage for OTP verification
      sessionStorage.setItem('pendingEmail', email)
      sessionStorage.setItem('pendingPassword', password)
      sessionStorage.setItem('pendingFirstName', firstName)
      sessionStorage.setItem('pendingLastName', lastName)
      sessionStorage.setItem('pendingCompanyName', companyName)
      sessionStorage.setItem('pendingContactNumber', contactNumber)
      sessionStorage.setItem('pendingTaxNumber', taxNumber)
      sessionStorage.setItem('isSignup', 'true')
      
      setSuccess(true)
      setShowNotification(true)
      
      // Hide notification and redirect to OTP verification after a delay
      setTimeout(() => {
        setShowNotification(false)
        router.push('/verify-otp')
      }, 3000)
      
    } catch (err) {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [email, password, confirmPassword, firstName, lastName, companyName, contactNumber, taxNumber, router])

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a 6-digit verification code to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to verification page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <div className="text-2xl">✅</div>
          <div>
            <p className="font-semibold">Sign Up Successful!</p>
            <p className="text-sm">Redirecting to verification...</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CarLend</h1>
          <p className="text-gray-600">Create your account to start renting vehicles</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    clearFieldError('firstName')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="Enter your first name"
                  required
                  disabled={loading}
                />
                {fieldErrors.firstName && <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    clearFieldError('lastName')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="Enter your last name"
                  required
                  disabled={loading}
                />
                {fieldErrors.lastName && <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearFieldError('email')
                }}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
              {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearFieldError('password')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    clearFieldError('confirmPassword')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    clearFieldError('companyName')
                  }}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.companyName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                placeholder="Enter your company name"
                required
                disabled={loading}
              />
              {fieldErrors.companyName && <p className="mt-1 text-sm text-red-600">{fieldErrors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value)
                    clearFieldError('contactNumber')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="+1 (555) 123-4567"
                  required
                  disabled={loading}
                />
                {fieldErrors.contactNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.contactNumber}</p>}
              </div>
              
              <div>
                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Number *
                </label>
                <input
                  type="text"
                  id="taxNumber"
                  name="taxNumber"
                  value={taxNumber}
                  onChange={(e) => {
                    setTaxNumber(e.target.value)
                    clearFieldError('taxNumber')
                  }}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.taxNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="Enter your tax number"
                  required
                  disabled={loading}
                />
                {fieldErrors.taxNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.taxNumber}</p>}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in instead
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> Use any email address. The verification code is <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
