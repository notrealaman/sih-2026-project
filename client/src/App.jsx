import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Assess from './pages/Student/Assess'
import Portfolio from './pages/Student/Portfolio'
import Recommend from './pages/Student/Recommend'
import Dashboard from './pages/Dashboard'
import Academician from './pages/Academician'
import Industry from './pages/Industry'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student/assess" element={<Assess />} />
          <Route path="/student/portfolio" element={<Portfolio />} />
          <Route path="/student/recommend" element={<Recommend />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academician" element={<Academician />} />
          <Route path="/industry" element={<Industry />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
