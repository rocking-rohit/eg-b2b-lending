'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { userApi, User } from '@/lib/api'

// Memoized UserRow component to prevent unnecessary re-renders
const UserRow = memo(({ user, onDelete }: { user: User; onDelete: (id: string) => void }) => (
  <tr className="hover:bg-gray-50 transition-colors duration-150">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {user.name || 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.email}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.company || 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.vehicles?.length || 0}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button
        onClick={() => onDelete(user.id)}
        className="text-red-600 hover:text-red-900 transition-colors duration-150"
      >
        Delete
      </button>
    </td>
  </tr>
))

UserRow.displayName = 'UserRow'

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userApi.getAll()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteUser = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await userApi.delete(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }, [])

  if (loading) return <div className="p-4">Loading users...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={fetchUsers}
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found. Create a new user to get started.
        </div>
      )}
    </div>
  )
}
