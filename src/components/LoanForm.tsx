'use client'

import { useState, useEffect } from 'react'
import { loanApi, userApi, LoanApplication, User } from '@/lib/api'

interface LoanFormProps {
  onLoanCreated?: (loan: LoanApplication) => void
}

export default function LoanForm({ onLoanCreated }: LoanFormProps) {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    purpose: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.userId || !formData.amount || !formData.purpose) {
      setError('All fields are required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const newLoan = await loanApi.create({
        user_id: formData.userId,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose
      })
      
      // Reset form
      setFormData({ userId: '', amount: '', purpose: '' })
      
      // Notify parent component
      if (onLoanCreated) {
        onLoanCreated(newLoan)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan application')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Create New Loan Application</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            Applicant *
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an applicant</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email} {user.company && `(${user.company})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Loan Amount *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Purpose *
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Loan Application'}
        </button>
      </form>
    </div>
  )
}
