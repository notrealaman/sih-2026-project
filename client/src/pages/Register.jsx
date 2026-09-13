import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'student', label: 'Student', desc: 'Clinical assessment & placement' },
  { value: 'academician', label: 'Academician', desc: 'Fellowships & research' },
  { value: 'organization', label: 'Organization', desc: 'Hiring & talent pipeline' }
]

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
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 px-12 max-w-md">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join MedBridge</h2>
          <p className="text-slate-400 leading-relaxed">Create your account and start connecting with the healthcare education ecosystem.</p>
          <div className="mt-12 space-y-4">
            {['Clinical skill assessments', 'Intelligent job matching', 'Real-time application tracking'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-lg font-bold text-slate-900">MedBridge</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-sm text-slate-500 mb-6">Choose your role and fill in your details.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => update('role', r.value)}
                    className={`p-3 rounded-lg text-center border transition-all ${
                      form.role === r.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>
                    <div className="text-sm font-semibold">{r.label}</div>
                    <div className="text-[11px] mt-0.5 opacity-70">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} className="input" placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution / Organization</label>
              <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)} className="input" placeholder="Optional" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
