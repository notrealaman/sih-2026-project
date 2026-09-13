import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'student', label: 'Student', icon: '🩺' },
  { value: 'academician', label: 'Academician', icon: '👨‍⚕️' },
  { value: 'organization', label: 'Healthcare Org', icon: '🏥' }
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', institution: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'student' ? '/student/assess' : user.role === 'organization' ? '/dashboard' : '/academician')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white">Med<span className="text-indigo-400">Bridge</span></Link>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-3xl p-8 border border-gray-800 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => update('role', r.value)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                    form.role === r.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                  }`}>
                  <div className="text-lg mb-1">{r.icon}</div>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Institution / Organization</label>
            <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
