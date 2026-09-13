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
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">MedBridge</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} className="btn-primary text-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="animate-slide-up">
            <span className="badge badge-blue mb-6">Smart India Hackathon 2026</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5 animate-slide-up delay-1">
            Healthcare talent,<br />precisely matched.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl animate-slide-up delay-2">
            Clinical skill assessment, intelligent job matching, and application pipeline management — built for the medical education ecosystem.
          </p>
          <div className="flex items-center gap-3 animate-slide-up delay-3">
            <Link to="/register" className="btn-primary text-base px-6 py-3">Create Account</Link>
            <Link to="/login" className="btn-secondary text-base px-6 py-3">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.label} className={`animate-slide-up delay-${i + 3}`}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className={`stat-change ${s.up ? 'stat-up' : 'stat-down'}`}>{s.change} this month</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Platform Capabilities</h2>
          <p className="text-slate-500">End-to-end healthcare talent management infrastructure.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className={`card p-6 animate-slide-up delay-${i + 3}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}10` }}>
                  <IconSVG type={f.icon} color={f.color} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container py-24">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Role-Based Access</h2>
            <p className="text-slate-500">Tailored interfaces for each stakeholder in the healthcare education pipeline.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Students', desc: 'Assess clinical competencies, discover opportunities, track applications.', path: '/student/assess', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { role: 'Academicians', desc: 'Fellowships, FDPs, research collaborations, and consultancy opportunities.', path: '/academician', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.42A12 12 0 0112 22.56' },
              { role: 'Organizations', desc: 'Post positions, manage applicants, analytics, and hiring pipeline.', path: '/industry', icon: 'M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16' }
            ].map((r, i) => (
              <Link key={r.role} to={r.path} className={`card p-6 group animate-slide-up delay-${i + 3}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d={r.icon} /></svg>
                <h3 className="font-semibold text-slate-900 mb-1">{r.role}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{r.desc}</p>
                <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="bg-slate-900 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Join thousands of healthcare professionals using MedBridge to find the right opportunities.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="btn-primary bg-white text-slate-900 hover:bg-slate-100 px-6 py-3">Create Account</Link>
            <Link to="/login" className="btn-secondary border-slate-700 text-slate-300 hover:bg-slate-800 px-6 py-3">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="container py-8 flex items-center justify-between">
          <p className="text-sm text-slate-400">© 2026 MedBridge. Smart India Hackathon.</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>Documentation</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
