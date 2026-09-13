import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'student' ? '/student/portfolio' : user.role === 'organization' ? '/dashboard' : '/academician')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white">Med<span className="text-indigo-400">Bridge</span></Link>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-3xl p-8 border border-gray-800 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300">Register</Link>
          </p>

          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-500 text-xs text-center mb-3">Demo accounts (password: password123)</p>
            <div className="grid grid-cols-1 gap-2">
              <button type="button" onClick={() => { setEmail('priya@demo.com'); setPassword('password123') }}
                className="bg-gray-800 text-gray-300 text-sm py-2 rounded-xl hover:bg-gray-700 transition-colors">
                🩺 Priya Sharma (Student)
              </button>
              <button type="button" onClick={() => { setEmail('rajesh@demo.com'); setPassword('password123') }}
                className="bg-gray-800 text-gray-300 text-sm py-2 rounded-xl hover:bg-gray-700 transition-colors">
                👨‍⚕️ Dr. Rajesh Kumar (Academician)
              </button>
              <button type="button" onClick={() => { setEmail('apollohospitals@demo.com'); setPassword('password123') }}
                className="bg-gray-800 text-gray-300 text-sm py-2 rounded-xl hover:bg-gray-700 transition-colors">
                🏥 Apollo Hospitals (Organization)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
