import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

function JobCard({ job, index, user, applied, onApply }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 hover:bg-white/5 transition-all animate-fade-in-up group" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/5 flex items-center justify-center text-white font-black text-lg shrink-0">
          {job.org_name?.[0] || 'H'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white group-hover:text-gradient transition-all">{job.title}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{job.org_name} · {job.type} · {job.duration} · {job.stipend}</p>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.required_skills.map(s => (
              <span key={s} className="bg-white/5 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/5">{s}</span>
            ))}
          </div>
        </div>
        {user?.role === 'student' && (
          <div className="shrink-0">
            {applied ? (
              <span className="bg-white/5 text-gray-400 text-xs font-bold px-5 py-2.5 rounded-xl border border-white/5">Applied ✓</span>
            ) : (
              <button onClick={() => onApply(job.id)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20">
                Apply
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Industry() {
  const [jobs, setJobs] = useState([])
  const [applied, setApplied] = useState(new Set())
  const { user } = useAuth()

  useEffect(() => {
    api.getJobs().then(setJobs)
    if (user) api.getMyApplications().then(apps => setApplied(new Set(apps.map(a => a.job_id))))
  }, [user])

  const handleApply = async (jobId) => {
    if (!user) return window.location.href = '/login'
    await api.apply({ job_id: jobId })
    setApplied(prev => new Set([...prev, jobId]))
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">Healthcare Positions</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">Open roles across hospitals and healthcare organizations</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-4">
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} user={user} applied={applied.has(job.id)} onApply={handleApply} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-4xl mb-4 animate-float">🏥</div>
            <p className="text-gray-400 text-lg">No positions available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
