'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { userApi } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [userType, setUserType] = useState<'borrower' | 'lender' | 'both'>('borrower')

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/signin')
      return
    }
    
    const userEmail = sessionStorage.getItem('userEmail')
    if (userEmail) {
      setEmail(userEmail)
    }

    // Pre-fill form with registration data if available
    const pendingFirstName = sessionStorage.getItem('pendingFirstName')
    const pendingLastName = sessionStorage.getItem('pendingLastName')
    const pendingCompanyName = sessionStorage.getItem('pendingCompanyName')
    const pendingContactNumber = sessionStorage.getItem('pendingContactNumber')
    const pendingTaxNumber = sessionStorage.getItem('pendingTaxNumber')

    if (pendingFirstName) setFirstName(pendingFirstName)
    if (pendingLastName) setLastName(pendingLastName)
    if (pendingCompanyName) setCompanyName(pendingCompanyName)
    if (pendingContactNumber) setPhoneNumber(pendingContactNumber)
    if (pendingTaxNumber) setTaxNumber(pendingTaxNumber)
  }, [isAuthenticated, router])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }
    if (!companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!companyAddress.trim()) newErrors.companyAddress = 'Company address is required'
    if (!companyPhone.trim()) newErrors.companyPhone = 'Company phone is required'
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(companyPhone)) {
      newErrors.companyPhone = 'Please enter a valid company phone number'
    }
    if (!taxNumber.trim()) newErrors.taxNumber = 'Tax number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [firstName, lastName, phoneNumber, companyName, companyAddress, companyPhone, taxNumber])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Create user profile
      const userData = {
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        company_name: companyName,
        company_address: companyAddress,
        company_phone: companyPhone,
        tax_number: taxNumber,
        user_type: userType,
        is_verified: true
      }

      const user = await userApi.create(userData)
      
      // Login user with auth context
      login({
        id: user.id,
        email: user.email,
        name: `${firstName} ${lastName}`,
        userType: userType
      })
      
      // Redirect to home page
      router.push('/')
      
    } catch (err) {
      setError('Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [email, firstName, lastName, phoneNumber, companyName, companyAddress, companyPhone, userType, validateForm, router])

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Please fill in your details to get started with CarLend</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                    placeholder="Enter your first name"
                    required
                    disabled={loading}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                    placeholder="Enter your last name"
                    required
                    disabled={loading}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  placeholder="+1 (555) 123-4567"
                  required
                  disabled={loading}
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                    placeholder="Enter your company name"
                    required
                    disabled={loading}
                  />
                  {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address *
                  </label>
                  <textarea
                    id="companyAddress"
                    rows={3}
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.companyAddress ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 resize-none`}
                    placeholder="Enter your company address"
                    required
                    disabled={loading}
                  />
                  {errors.companyAddress && <p className="mt-1 text-sm text-red-600">{errors.companyAddress}</p>}
                </div>

                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Phone *
                  </label>
                  <input
                    type="tel"
                    id="companyPhone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.companyPhone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                    placeholder="+1 (555) 123-4567"
                    required
                    disabled={loading}
                  />
                  {errors.companyPhone && <p className="mt-1 text-sm text-red-600">{errors.companyPhone}</p>}
                </div>

                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Number *
                  </label>
                  <input
                    type="text"
                    id="taxNumber"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.taxNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                    placeholder="Enter your tax number"
                    required
                    disabled={loading}
                  />
                  {errors.taxNumber && <p className="mt-1 text-sm text-red-600">{errors.taxNumber}</p>}
                </div>
              </div>
            </div>

            {/* User Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Type</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="userType"
                    value="borrower"
                    checked={userType === 'borrower'}
                    onChange={(e) => setUserType(e.target.value as 'borrower' | 'lender' | 'both')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Borrower</div>
                    <div className="text-sm text-gray-600">I want to rent vehicles for my business needs</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="userType"
                    value="lender"
                    checked={userType === 'lender'}
                    onChange={(e) => setUserType(e.target.value as 'borrower' | 'lender' | 'both')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Lender</div>
                    <div className="text-sm text-gray-600">I want to rent out my vehicles to earn money</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="radio"
                    name="userType"
                    value="both"
                    checked={userType === 'both'}
                    onChange={(e) => setUserType(e.target.value as 'borrower' | 'lender' | 'both')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Both</div>
                    <div className="text-sm text-gray-600">I want to both rent and lend vehicles</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Display */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {email}
              </p>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
