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
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'student' ? '/student/portfolio' : user.role === 'organization' ? '/dashboard' : '/academician')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 px-12 max-w-md">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome back to MedBridge</h2>
          <p className="text-slate-400 leading-relaxed">Sign in to access your clinical skill assessments, job matches, and application pipeline.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[{ n: '2,400+', l: 'Students' }, { n: '85', l: 'Partners' }, { n: '1,200+', l: 'Placements' }, { n: '94%', l: 'Match Rate' }].map(s => (
              <div key={s.l} className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-white">{s.n}</div>
                <div className="text-xs text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-lg font-bold text-slate-900">MedBridge</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-8">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">Create one</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-2">
              {[
                { email: 'priya@demo.com', label: 'Priya Sharma — Student', badge: 'Student' },
                { email: 'rajesh@demo.com', label: 'Dr. Rajesh Kumar — Academician', badge: 'Faculty' },
                { email: 'apollohospitals@demo.com', label: 'Apollo Hospitals — Organization', badge: 'Org' }
              ].map(d => (
                <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword('password123') }}
                  className="w-full text-left px-3 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group">
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{d.label}</span>
                  <span className="badge badge-gray text-[10px]">{d.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
