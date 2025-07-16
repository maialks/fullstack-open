import { createContext, useContext, useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const client = useApolloClient()

  useEffect(() => {
    const storedToken = localStorage.getItem('booksapp-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.removeItem('booksapp-user-token')
    client.resetStore()
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
