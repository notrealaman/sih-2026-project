import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

function MatchBadge({ score }) {
  const color = score >= 70 ? 'from-green-400 to-emerald-500 text-green-300' : score >= 40 ? 'from-yellow-400 to-orange-500 text-yellow-300' : 'from-gray-500 to-gray-600 text-gray-400'
  return (
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex flex-col items-center justify-center shadow-lg`}>
      <span className="text-2xl font-black">{score}</span>
      <span className="text-[10px] font-bold opacity-70">%</span>
    </div>
  )
}

function JobCard({ job, index, onApply, applied }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 hover:bg-white/5 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-white font-black text-lg shrink-0">
          {job.org_name?.[0] || 'H'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white">{job.title}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{job.org_name} · {job.type} · {job.duration}</p>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{job.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-semibold text-indigo-400">{job.stipend}</span>
          </div>
        </div>
        <div className="flex sm:flex-col items-center gap-3 shrink-0">
          <MatchBadge score={job.matchScore} />
          {applied ? (
            <span className="bg-white/5 text-gray-400 text-xs font-bold px-4 py-2 rounded-xl border border-white/5">Applied ✓</span>
          ) : (
            <button onClick={() => onApply(job.id)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20">
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [applied, setApplied] = useState(new Set())
  const { user } = useAuth()

  useEffect(() => {
    api.getJobs().then(allJobs => {
      const data = sessionStorage.getItem('skillProfile')
      if (data) {
        const p = JSON.parse(data)
        setProfile(p)
        const userSkills = p.profile.filter(s => s.level >= 50).map(s => s.id)
        const scored = allJobs.map(j => {
          const matched = j.required_skills.filter(s => userSkills.includes(s))
          return { ...j, matchScore: Math.round((matched.length / j.required_skills.length) * 100) }
        }).sort((a, b) => b.matchScore - a.matchScore)
        setJobs(scored)
      } else {
        setJobs(allJobs.map(j => ({ ...j, matchScore: 0 })))
      }
    })
    if (user) api.getMyApplications().then(apps => setApplied(new Set(apps.map(a => a.job_id))))
  }, [user])

  const handleApply = async (jobId) => {
    if (!user) return window.location.href = '/login'
    await api.apply({ job_id: jobId })
    setApplied(prev => new Set([...prev, jobId]))
  }

  if (!profile) return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-6 px-4">
      <svg viewBox="0 0 120 120" className="w-24 h-24 animate-float">
        <circle cx="60" cy="60" r="50" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" style={{ transformOrigin: '60px 60px' }} />
        <circle cx="60" cy="60" r="8" fill="#10b981" />
      </svg>
      <p className="text-xl text-gray-400 text-center">Take the assessment first to see matched positions.</p>
      <Link to="/student/assess" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity">Start Assessment</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/20 to-indigo-600/20" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">Opportunities For You</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">{jobs.length} positions matched to your skills</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-4">
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} onApply={handleApply} applied={applied.has(job.id)} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">No positions available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
