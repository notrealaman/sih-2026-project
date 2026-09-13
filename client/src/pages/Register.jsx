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
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ flex: '0 0 50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="register-left-panel">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative', zIndex: 10, padding: '0 48px', maxWidth: 440 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>Join MedBridge</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>Create your account and start connecting with the healthcare education ecosystem.</p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Clinical skill assessments', 'Intelligent job matching', 'Real-time application tracking'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <span style={{ fontSize: 14, color: '#cbd5e1' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 24px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>MedBridge</span>
          </Link>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Create account</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Choose your role and fill in your details.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 14, padding: '12px 16px', borderRadius: 8 }}>{error}</div>}

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }} className="role-selector">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => update('role', r.value)}
                    style={{ padding: 12, borderRadius: 8, textAlign: 'center', border: `1px solid ${form.role === r.value ? '#2563eb' : '#e2e8f0'}`, background: form.role === r.value ? '#eff6ff' : '#fff', color: form.role === r.value ? '#2563eb' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 11, marginTop: 2, opacity: 0.7 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} className="input" placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Institution / Organization</label>
              <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)} className="input" placeholder="Optional" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .register-left-panel { display: none !important; }
        }
        @media (max-width: 480px) {
          .role-selector { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
