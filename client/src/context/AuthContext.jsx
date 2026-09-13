import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) { setLoading(false); return }
    api.me().then(setUser).catch(() => { sessionStorage.removeItem('token'); setLoading(false) })
    setTimeout(() => setLoading(false), 2000)
  }, [])

  const login = async (email, password) => {
    const { user, token } = await api.login({ email, password })
    sessionStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const register = async (data) => {
    const { user, token } = await api.register(data)
    sessionStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const logout = () => { sessionStorage.removeItem('token'); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
