'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { loanApi, LoanApplication } from '@/lib/api'

// Memoized LoanRow component to prevent unnecessary re-renders
const LoanRow = memo(({ 
  loan, 
  onDelete, 
  onStatusUpdate, 
  getStatusColor 
}: { 
  loan: LoanApplication
  onDelete: (id: string) => void
  onStatusUpdate: (id: string, status: string) => void
  getStatusColor: (status: string) => string
}) => (
  <tr className="hover:bg-gray-50 transition-colors duration-150">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        {loan.user?.name || 'N/A'}
      </div>
      <div className="text-sm text-gray-500">
        {loan.user?.email}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      ${loan.amount.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {loan.purpose}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <select
        value={loan.status}
        onChange={(e) => onStatusUpdate(loan.id, e.target.value)}
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)} border-0 transition-colors duration-150`}
      >
        <option value="PENDING">Pending</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(loan.created_at).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button
        onClick={() => onDelete(loan.id)}
        className="text-red-600 hover:text-red-900 transition-colors duration-150"
      >
        Delete
      </button>
    </td>
  </tr>
))

LoanRow.displayName = 'LoanRow'

export default function LoansList() {
  const [loans, setLoans] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loanApi.getAll()
      setLoans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteLoan = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan application?')) return

    try {
      await loanApi.delete(id)
      setLoans(prev => prev.filter(loan => loan.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan application')
    }
  }, [])

  const handleStatusUpdate = useCallback(async (id: string, newStatus: string) => {
    try {
      const updatedLoan = await loanApi.update(id, { status: newStatus })
      setLoans(prev => prev.map(loan => loan.id === id ? updatedLoan : loan))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan status')
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  if (loading) return <div className="p-4">Loading loan applications...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Loan Applications</h2>
        <button
          onClick={fetchLoans}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-150"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <LoanRow 
                key={loan.id} 
                loan={loan} 
                onDelete={handleDeleteLoan}
                onStatusUpdate={handleStatusUpdate}
                getStatusColor={getStatusColor}
              />
            ))}
          </tbody>
        </table>
      </div>

      {loans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No loan applications found.
        </div>
      )}
    </div>
  )
}
