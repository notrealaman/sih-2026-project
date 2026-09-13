import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TopNav({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setOpen(false) }

  const dashboardPath = user?.role === 'student' ? '/student/portfolio' : '/dashboard'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-2V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" /><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-2v-4" /><circle cx="20" cy="10" r="2" /></svg>
            </div>
            <span className="text-sm font-bold text-slate-900 hidden sm:inline">MedBridge</span>
          </Link>
          {title && (
            <>
              <span className="text-slate-300 text-sm">/</span>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
                {subtitle && <p className="text-[11px] text-slate-400 leading-none">{subtitle}</p>}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell placeholder */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          </button>

          {/* User menu */}
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-scale-in z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  <span className="badge badge-gray text-[10px] mt-1 capitalize">{user?.role}</span>
                </div>
                <Link to={dashboardPath} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                  Dashboard
                </Link>
                {user?.role === 'student' && (
                  <>
                    <Link to="/student/assess" onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                      Assessment
                    </Link>
                    <Link to="/student/recommend" onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                      Opportunities
                    </Link>
                  </>
                )}
                {user?.role === 'organization' && (
                  <Link to="/industry" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
                    Positions
                  </Link>
                )}
                {user?.role === 'academician' && (
                  <Link to="/academician" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.42A12 12 0 0112 22.56" /></svg>
                    Opportunities
                  </Link>
                )}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
  )
}
