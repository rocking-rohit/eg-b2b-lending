'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('✅ Supabase connection successful!')
      }
    } catch (err) {
      setStatus(`Connection failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {status && (
        <p className="mt-2 text-sm">{status}</p>
      )}
    </div>
  )
}
