'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  userType: 'borrower' | 'lender' | 'both'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    const userEmail = sessionStorage.getItem('userEmail')
    const userId = sessionStorage.getItem('userId')
    const userName = sessionStorage.getItem('userName')
    const userType = sessionStorage.getItem('userType') as 'borrower' | 'lender' | 'both'

    if (isAuthenticated && userEmail && userId && userName) {
      setUser({
        id: userId,
        email: userEmail,
        name: userName,
        userType: userType || 'borrower'
      })
    }
    
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('userEmail', userData.email)
    sessionStorage.setItem('userId', userData.id)
    sessionStorage.setItem('userName', userData.name)
    sessionStorage.setItem('userType', userData.userType)
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('userType')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
