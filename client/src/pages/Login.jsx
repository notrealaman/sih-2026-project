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
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left — illustration panel */}
      <div style={{ flex: '0 0 50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="login-left-panel">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative', zIndex: 10, padding: '0 48px', maxWidth: 440 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>Welcome back to MedBridge</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>Sign in to access your clinical skill assessments, job matches, and application pipeline.</p>
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[{ n: '2,400+', l: 'Students' }, { n: '85', l: 'Partners' }, { n: '1,200+', l: 'Placements' }, { n: '94%', l: 'Match Rate' }].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 24px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>MedBridge</span>
          </Link>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 14, padding: '12px 16px', borderRadius: 8 }}>{error}</div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 }}>
            No account? <Link to="/register" style={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>Create one</Link>
          </p>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { email: 'priya@demo.com', label: 'Priya Sharma — Student', badge: 'Student' },
                { email: 'rajesh@demo.com', label: 'Dr. Rajesh Kumar — Academician', badge: 'Faculty' },
                { email: 'apollohospitals@demo.com', label: 'Apollo Hospitals — Organization', badge: 'Org' }
              ].map(d => (
                <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword('password123') }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{d.label}</span>
                  <span className="badge badge-gray" style={{ fontSize: 10 }}>{d.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  )
}
