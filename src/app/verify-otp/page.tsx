'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyOTPPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email and signup status from session storage
    const storedEmail = sessionStorage.getItem('pendingEmail')
    const storedIsSignup = sessionStorage.getItem('isSignup')
    
    if (!storedEmail) {
      router.push('/signin')
      return
    }
    
    setEmail(storedEmail)
    setIsSignup(storedIsSignup === 'true')
  }, [router])

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [otp])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [otp])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    setError(null)
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '')
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }, [otp])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    if (otpString !== '123456') {
      setError('Invalid verification code. Please try again.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, create a temporary user for existing users
      if (!isSignup) {
        // Existing user - create temporary user data
        login({
          id: 'temp-user-id',
          email: email,
          name: 'Existing User',
          userType: 'borrower'
        })
        router.push('/')
      } else {
        // New user - create user account and redirect to homepage
        const pendingFirstName = sessionStorage.getItem('pendingFirstName')
        const pendingLastName = sessionStorage.getItem('pendingLastName')
        const pendingCompanyName = sessionStorage.getItem('pendingCompanyName')
        const pendingContactNumber = sessionStorage.getItem('pendingContactNumber')
        const pendingTaxNumber = sessionStorage.getItem('pendingTaxNumber')
        const pendingPassword = sessionStorage.getItem('pendingPassword')
        
        // Create user account with all registration data
        const userData = {
          email: email,
          password: pendingPassword,
          first_name: pendingFirstName,
          last_name: pendingLastName,
          company_name: pendingCompanyName,
          phone_number: pendingContactNumber,
          tax_number: pendingTaxNumber,
          user_type: 'borrower',
          is_verified: true
        }
        
        // Log in the new user
        login({
          id: 'new-user-id',
          email: email,
          name: `${pendingFirstName} ${pendingLastName}`,
          userType: 'borrower'
        })
        
        // Clean up all pending data
        sessionStorage.removeItem('pendingFirstName')
        sessionStorage.removeItem('pendingLastName')
        sessionStorage.removeItem('pendingCompanyName')
        sessionStorage.removeItem('pendingContactNumber')
        sessionStorage.removeItem('pendingTaxNumber')
        sessionStorage.removeItem('pendingPassword')
        
        router.push('/')
      }
      
      // Clean up session storage
      sessionStorage.removeItem('pendingEmail')
      sessionStorage.removeItem('isSignup')
      
    } catch (err) {
      setError('Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [otp, email, isSignup, router])

  const handleResendCode = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset OTP input
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-xl font-bold border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
                  disabled={loading}
                />
              ))}
            </div>
            {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              loading || otp.join('').length !== 6
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
          >
            Resend Code
          </button>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo Mode:</strong> Use code <strong>123456</strong>
          </p>
        </div>

        {/* Back to Sign In */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/signin')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
