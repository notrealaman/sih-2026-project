import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { title: 'Student', desc: 'Clinical skills assessment & placement', path: '/student/assess', color: 'from-blue-500 to-indigo-600', hoverShadow: 'hover:shadow-blue-500/30', icon: '🩺' },
  { title: 'Academician', desc: 'Faculty fellowships, FDPs & research', path: '/academician', color: 'from-purple-500 to-pink-600', hoverShadow: 'hover:shadow-purple-500/30', icon: '👨‍⚕️' },
  { title: 'Healthcare Org', desc: 'Post roles & discover talent', path: '/industry', color: 'from-emerald-500 to-teal-600', hoverShadow: 'hover:shadow-emerald-500/30', icon: '🏥' }
]

export default function Landing() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16 sm:p-8 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

      {/* Top nav */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        {user ? (
          <>
            <Link to={user.role === 'student' ? '/student/portfolio' : '/dashboard'} className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              Dashboard
            </Link>
            <button onClick={logout} className="text-gray-400 text-sm font-medium hover:text-white transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-500 transition-colors">
              Get Started
            </Link>
          </>
        )}
      </div>

      <div className="text-center mb-10 sm:mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-indigo-300 text-sm font-medium">Healthcare Skill Mapping Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 animate-fade-in-up delay-100 leading-tight">
          Med<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Bridge</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
          Bridge the gap between medical education and clinical practice.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative z-10 animate-fade-in-up delay-200">
        {roles.map((role) => (
          <Link key={role.title} to={role.path}
            className={`group flex items-center gap-3 bg-gradient-to-r ${role.color} text-white pl-4 pr-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-all duration-200 shadow-lg ${role.hoverShadow} hover:shadow-xl`}>
            <span className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{role.icon}</span>
            <div className="text-left">
              <div className="font-bold leading-tight">{role.title}</div>
              <div className="text-white/60 text-xs leading-tight hidden sm:block">{role.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 text-center relative z-10 animate-fade-in-up delay-300">
        <p className="text-gray-600 text-sm">Built for Smart India Hackathon 2026 — Healthcare Edition</p>
      </div>
    </div>
  )
}
