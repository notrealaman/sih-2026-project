import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'student', label: 'Student', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg> },
  { value: 'academician', label: 'Academician', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.42A12 12 0 0112 22.56" /></svg> },
  { value: 'organization', label: 'Healthcare Org', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" /><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg> }
]

function RegisterIllustration() {
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs animate-float-delay">
      <defs>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="110" fill="rgba(168,85,247,0.05)" stroke="rgba(168,85,247,0.12)" strokeWidth="1" />
      <rect x="100" y="90" width="100" height="120" rx="16" fill="url(#lg2)" opacity="0.15" stroke="url(#lg2)" strokeWidth="1.5" />
      <circle cx="150" cy="125" r="20" fill="url(#lg2)" opacity="0.8" />
      <path d="M142 125 L148 131 L158 119" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="120" y="160" width="60" height="6" rx="3" fill="white" opacity="0.3" />
      <rect x="130" y="175" width="40" height="6" rx="3" fill="white" opacity="0.2" />
      <circle cx="80" cy="80" r="6" fill="#a855f7" opacity="0.3" className="animate-pulse" />
      <circle cx="220" cy="100" r="4" fill="#ec4899" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      <circle cx="100" cy="220" r="5" fill="#818cf8" opacity="0.2" className="animate-pulse" style={{ animationDelay: '1s' }} />
    </svg>
  )
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', institution: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'student' ? '/student/assess' : user.role === 'organization' ? '/dashboard' : '/academician')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-mesh flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10" />
        <RegisterIllustration />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-xl font-black text-white">Med<span className="text-gradient">Bridge</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2 animate-fade-in-up">Create account</h1>
          <p className="text-gray-400 mb-6 animate-fade-in-up delay-100">Join the healthcare community</p>

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-200">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => update('role', r.value)}
                    className={`py-3 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center gap-1.5 ${
                      form.role === r.value ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                    }`}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Institution / Organization</label>
              <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-indigo-500/25">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 animate-fade-in-up delay-300">
            Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
