import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Assess from './pages/Student/Assess'
import Portfolio from './pages/Student/Portfolio'
import Recommend from './pages/Student/Recommend'
import Dashboard from './pages/Dashboard'
import Academician from './pages/Academician'
import Industry from './pages/Industry'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} replace />
  return children
}

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} replace />
  return <Landing />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/student/assess" element={<ProtectedRoute><Assess /></ProtectedRoute>} />
          <Route path="/student/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/student/recommend" element={<ProtectedRoute><Recommend /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/academician" element={<ProtectedRoute><Academician /></ProtectedRoute>} />
          <Route path="/industry" element={<ProtectedRoute><Industry /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
