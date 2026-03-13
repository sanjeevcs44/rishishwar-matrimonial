import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { tokenManager } from '../utils/tokenManager'

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }
export type { User, AuthContextType }

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return tokenManager.isAuthenticated()
  })
  const [user, setUser] = useState<User | null>(() => {
    return tokenManager.getUserData()
  })

  // Function to check and update auth state
  const checkAuth = (): boolean => {
    const authStatus = tokenManager.isAuthenticated()
    const userData = tokenManager.getUserData()

    setIsAuthenticated(authStatus)
    setUser(userData)

    return authStatus
  }

  // Listen for storage changes (token updates from login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth()
    }

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange)

    // Also listen for a custom event we'll dispatch on login/logout
    window.addEventListener('authChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleStorageChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
