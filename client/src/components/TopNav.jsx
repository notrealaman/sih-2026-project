import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TopNav({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); setMobileOpen(false) }

  const dashboardPath = user?.role === 'student' ? '/student/portfolio' : '/dashboard'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const navLinks = [
    { to: dashboardPath, label: 'Dashboard', roles: ['student', 'organization', 'academician'] },
    { to: '/student/assess', label: 'Assessment', roles: ['student'] },
    { to: '/student/recommend', label: 'Opportunities', roles: ['student'] },
    { to: '/industry', label: 'Positions', roles: ['organization'] },
    { to: '/academician', label: 'Opportunities', roles: ['academician'] },
  ]

  const visibleLinks = navLinks.filter(l => l.roles.includes(user?.role))

  return (
    <>
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Left: hamburger + logo + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setMobileOpen(true)} style={{ display: 'none', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }} className="mobile-menu-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
              </div>
              <span className="hidden sm:inline" style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>MedBridge</span>
            </Link>
            {title && (
              <>
                <span style={{ color: '#cbd5e1', fontSize: 14 }}>/</span>
                <div>
                  <h1 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{title}</h1>
                  {subtitle && <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1 }}>{subtitle}</p>}
                </div>
              </>
            )}
          </div>

          {/* Right: desktop links + bell + profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
              {visibleLinks.map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: 13, fontWeight: 500, color: '#64748b', textDecoration: 'none', padding: '6px 10px', borderRadius: 6, transition: 'all 0.15s' }}>
                  {l.label}
                </Link>
              ))}
            </div>
            <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
            </button>
            <div style={{ position: 'relative' }} ref={ref}>
              <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 4px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials}</div>
                <span className="hidden sm:inline" style={{ fontSize: 13, fontWeight: 500, color: '#475569', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#94a3b8', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {open && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 220, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: '4px', zIndex: 50 }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    <span className="badge badge-gray" style={{ fontSize: 10, marginTop: 4, textTransform: 'capitalize' }}>{user?.role}</span>
                  </div>
                  {visibleLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#334155', textDecoration: 'none', borderRadius: 6, transition: 'background 0.1s' }}>
                      {l.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#dc2626', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      <div className={`nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile drawer */}
      <div className={`nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>MedBridge</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: '12px 12px', flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px', marginBottom: 4 }}>Navigation</p>
          {visibleLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 14, fontWeight: 500, color: '#334155', textDecoration: 'none', borderRadius: 8, marginBottom: 2 }}>
              {l.label}
            </Link>
          ))}
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 16, paddingTop: 8 }}>
            <div style={{ padding: '8px 12px', marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 14, fontWeight: 500, color: '#dc2626', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
