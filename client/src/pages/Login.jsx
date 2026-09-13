import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginIllustration() {
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs animate-float">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="120" fill="rgba(99,102,241,0.05)" stroke="rgba(129,140,248,0.15)" strokeWidth="1" />
      <circle cx="150" cy="150" r="90" fill="rgba(168,85,247,0.05)" stroke="rgba(168,85,247,0.1)" strokeWidth="1" />
      <rect x="105" y="100" width="90" height="110" rx="12" fill="url(#lg1)" opacity="0.9" />
      <rect x="120" y="115" width="60" height="8" rx="4" fill="white" opacity="0.3" />
      <rect x="120" y="130" width="40" height="8" rx="4" fill="white" opacity="0.2" />
      <circle cx="150" cy="170" r="12" fill="white" opacity="0.9" />
      <path d="M145 170 L148 173 L155 166" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="150" cy="150" r="80" fill="none" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 6" className="animate-spin-slow" style={{ transformOrigin: '150px 150px' }} />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'student' ? '/student/portfolio' : user.role === 'organization' ? '/dashboard' : '/academician')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* Left illustration - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10" />
        <LoginIllustration />
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-xl font-black text-white">Med<span className="text-gradient">Bridge</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2 animate-fade-in-up">Welcome back</h1>
          <p className="text-gray-400 mb-8 animate-fade-in-up delay-100">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-200">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-indigo-500/25">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 animate-fade-in-up delay-300">
            Don't have an account? <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300">Register</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/5 animate-fade-in-up delay-400">
            <p className="text-gray-500 text-xs text-center mb-3">Quick demo login</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { email: 'priya@demo.com', label: '🩺 Priya Sharma (Student)', bg: 'from-blue-500/10 to-indigo-500/10' },
                { email: 'rajesh@demo.com', label: '👨‍⚕️ Dr. Rajesh Kumar (Academician)', bg: 'from-purple-500/10 to-pink-500/10' },
                { email: 'apollohospitals@demo.com', label: '🏥 Apollo Hospitals (Org)', bg: 'from-emerald-500/10 to-teal-500/10' }
              ].map(d => (
                <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword('password123') }}
                  className={`bg-gradient-to-r ${d.bg} border border-white/5 text-gray-300 text-sm py-2.5 rounded-xl hover:border-white/10 transition-all`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
