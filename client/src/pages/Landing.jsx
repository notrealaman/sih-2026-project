import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Active Students', value: '2,400+', change: '+18%', up: true },
  { label: 'Healthcare Partners', value: '85', change: '+12%', up: true },
  { label: 'Placements', value: '1,200+', change: '+24%', up: true },
  { label: 'Match Accuracy', value: '94.2%', change: '+2.1%', up: true }
]

const features = [
  { title: 'Skill Assessment', desc: 'Clinical competency mapping across 20+ healthcare domains with standardized evaluation.', icon: 'chart', color: '#2563eb' },
  { title: 'Smart Matching', desc: 'Algorithm-driven pairing of student competencies with organizational requirements.', icon: 'target', color: '#7c3aed' },
  { title: 'Application Pipeline', desc: 'End-to-end tracking from application submission through placement confirmation.', icon: 'pipeline', color: '#059669' },
  { title: 'Analytics Dashboard', desc: 'Real-time insights into skill trends, hiring patterns, and placement outcomes.', icon: 'analytics', color: '#d97706' }
]

const IconSVG = ({ type, color }) => {
  const props = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'chart') return <svg {...props}><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
  if (type === 'target') return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  if (type === 'pipeline') return <svg {...props}><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 12h3M14 12h3" /></svg>
  if (type === 'analytics') return <svg {...props}><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-10" /></svg>
  return null
}

export default function Landing() {
  const { user } = useAuth()
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>MedBridge</span>
          </Link>
          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden-mobile">
            {user ? (
              <Link to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} className="btn-primary" style={{ fontSize: 14 }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{ fontSize: 14 }}>Sign in</Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: 14 }}>Get Started</Link>
              </>
            )}
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileNav(!mobileNav)} style={{ display: 'none', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }} className="mobile-menu-btn-landing">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileNav && (
          <div style={{ padding: '12px 24px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }} className="mobile-nav-landing">
            {user ? (
              <Link to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} onClick={() => setMobileNav(false)} className="btn-primary" style={{ justifyContent: 'center' }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileNav(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>Sign in</Link>
                <Link to="/register" onClick={() => setMobileNav(false)} className="btn-primary" style={{ justifyContent: 'center' }}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 0 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: 720 }}>
            <span className="badge badge-blue" style={{ marginBottom: 24, display: 'inline-flex' }}>Smart India Hackathon 2026</span>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#0f172a', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }} className="hero-title">
              Healthcare talent,<br />precisely matched.
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
              Clinical skill assessment, intelligent job matching, and application pipeline management — built for the medical education ecosystem.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>Create Account</Link>
              <Link to="/login" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="stats-grid">
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: '#16a34a' }}>{s.change} this month</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />

      {/* Features */}
      <section>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Platform Capabilities</h2>
            <p style={{ color: '#64748b' }}>End-to-end healthcare talent management infrastructure.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${f.color}10` }}>
                    <IconSVG type={f.icon} color={f.color} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />

      {/* Roles */}
      <section style={{ background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Role-Based Access</h2>
            <p style={{ color: '#64748b' }}>Tailored interfaces for each stakeholder in the healthcare education pipeline.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="roles-grid">
            {[
              { role: 'Students', desc: 'Assess clinical competencies, discover opportunities, track applications.', path: '/student/assess', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { role: 'Academicians', desc: 'Fellowships, FDPs, research collaborations, and consultancy opportunities.', path: '/academician', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.42A12 12 0 0112 22.56' },
              { role: 'Organizations', desc: 'Post positions, manage applicants, analytics, and hiring pipeline.', path: '/industry', icon: 'M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16' }
            ].map((r) => (
              <Link key={r.role} to={r.path} className="card" style={{ padding: 24, textDecoration: 'none', display: 'block' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}><path d={r.icon} /></svg>
                <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{r.role}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Explore <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />

      {/* CTA */}
      <section>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ background: '#0f172a', borderRadius: 16, padding: '60px 48px', textAlign: 'center' }} className="cta-box">
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ color: '#94a3b8', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>Join thousands of healthcare professionals using MedBridge to find the right opportunities.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ background: '#fff', color: '#0f172a', padding: '14px 28px' }}>Create Account</Link>
              <Link to="/login" className="btn-secondary" style={{ borderColor: '#334155', color: '#cbd5e1', padding: '14px 28px' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>© 2026 MedBridge. Smart India Hackathon.</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#94a3b8' }}>
            <span>Documentation</span>
            <span>Support</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .hero-title { font-size: 32px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
          .cta-box { padding: 40px 24px !important; }
          .mobile-menu-btn-landing { display: flex !important; }
          .mobile-nav-landing { display: flex !important; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
