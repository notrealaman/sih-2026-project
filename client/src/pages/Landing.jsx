import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { title: 'Student', desc: 'Clinical skills assessment & placement', path: '/student/assess', gradient: 'from-blue-500 to-indigo-600', icon: 'student', color: '#6366f1' },
  { title: 'Academician', desc: 'Faculty fellowships, FDPs & research', path: '/academician', gradient: 'from-purple-500 to-pink-600', icon: 'academician', color: '#a855f7' },
  { title: 'Healthcare Org', desc: 'Post roles & discover talent', path: '/industry', gradient: 'from-emerald-500 to-teal-600', icon: 'org', color: '#10b981' }
]

function StethoscopeSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-64 sm:h-64 animate-float">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="8 4" className="animate-spin-slow" style={{ transformOrigin: 'center' }} />
      <circle cx="100" cy="100" r="70" fill="rgba(99,102,241,0.05)" stroke="rgba(129,140,248,0.2)" strokeWidth="1" />
      <path d="M80 60 C80 45 120 45 120 60 L120 90 C120 110 100 130 100 130 C100 130 80 110 80 90 Z" fill="url(#grad1)" opacity="0.9" className="animate-heartbeat" style={{ transformOrigin: '100px 90px' }} />
      <circle cx="100" cy="75" r="6" fill="white" opacity="0.8" />
      <path d="M60 140 Q70 120 80 140 Q90 160 100 140" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M100 140 Q110 120 120 140 Q130 160 140 140" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-float"
          style={{
            width: `${8 + i * 4}px`, height: `${8 + i * 4}px`,
            left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%`,
            background: `rgba(${99 + i * 20}, ${102 + i * 15}, 241, ${0.1 + i * 0.03})`,
            animationDelay: `${i * 0.5}s`, animationDuration: `${4 + i}s`
          }} />
      ))}
    </div>
  )
}

function WaveBottom() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
      <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 L1000,200 L0,200 Z" fill="rgba(99,102,241,0.05)">
          <animate attributeName="d" dur="8s" repeatCount="indefinite"
            values="M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 L1000,200 L0,200 Z;M0,100 C150,60 350,120 500,100 C650,60 850,120 1000,100 L1000,200 L0,200 Z;M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 L1000,200 L0,200 Z" />
        </path>
      </svg>
    </div>
  )
}

export default function Landing() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      <FloatingParticles />
      <WaveBottom />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
          </div>
          <span className="text-xl font-black text-white">Med<span className="text-gradient">Bridge</span></span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">Dashboard</Link>
              <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">Sign in</Link>
              <Link to="/register" className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 pt-8 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto">
        <div className="text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Healthcare Skill Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 animate-fade-in-up delay-100">
            Where Medical Talent Meets <span className="text-gradient">Opportunity</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed animate-fade-in-up delay-200">
            Assess clinical skills, discover internships, and bridge the gap between medical education and healthcare practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up delay-300">
            <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold text-center hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
              Start Your Journey
            </Link>
            <Link to="/login" className="glass text-white px-8 py-3.5 rounded-2xl font-bold text-center hover:bg-white/5 transition-colors">
              Sign In
            </Link>
          </div>
          <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start animate-fade-in-up delay-500">
            {[
              { n: '50+', l: 'Healthcare Orgs' },
              { n: '200+', l: 'Students' },
              { n: '95%', l: 'Match Rate' }
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-black text-gradient">{s.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-fade-in delay-300">
          <StethoscopeSVG />
        </div>
      </div>

      {/* Role cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8 animate-fade-in-up">Choose Your Path</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <Link key={role.title} to={role.path}
              className={`group glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${role.color}20` }}>
                {role.icon === 'student' && <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={role.color} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
                {role.icon === 'academician' && <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={role.color} strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.42A12 12 0 0112 22.56a12 12 0 01-6.16-11.98L12 14z" /></svg>}
                {role.icon === 'org' && <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={role.color} strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" /><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{role.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{role.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: role.color }}>
                Explore <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8">
        <p className="text-gray-600 text-xs">Built for Smart India Hackathon 2026</p>
      </div>
    </div>
  )
}
