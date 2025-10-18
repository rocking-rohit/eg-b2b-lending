'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store email and password in session storage for OTP verification
      sessionStorage.setItem('pendingEmail', email)
      sessionStorage.setItem('pendingPassword', password)
      sessionStorage.setItem('isSignup', 'false')
      
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
  }, [email, router])

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-blue-500 text-6xl mb-4">📧</div>
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
            <p className="font-semibold">Sign In Successful!</p>
            <p className="text-sm">Redirecting to verification...</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CarLend account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150`}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up instead
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
