import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { User } from '@/types/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAdmin: boolean
  isOfficer: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('flora_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [token, setToken] = useState<string | null>(localStorage.getItem('flora_token'))

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('flora_token', newToken)
    localStorage.setItem('flora_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('flora_token')
    localStorage.removeItem('flora_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isOfficer: user?.role === 'officer' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
