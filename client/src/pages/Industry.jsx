import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Industry() {
  const [jobs, setJobs] = useState([])
  const { user } = useAuth()

  useEffect(() => { api.getJobs().then(setJobs) }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Healthcare Positions</h1>
          <p className="text-white/60">Open positions across hospitals and healthcare organizations</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-4">
        {jobs.map((job, i) => (
          <div key={job.id} className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                {job.org_name?.[0] || 'H'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-white">{job.title}</h3>
                <p className="text-gray-400 text-sm">{job.org_name} · {job.type} · {job.duration} · {job.stipend}</p>
                <p className="text-gray-500 text-sm mt-2">{job.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.required_skills.map(s => (
                    <span key={s} className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
              {user?.role === 'student' && (
                <button onClick={() => api.apply({ job_id: job.id }).then(() => alert('Applied!'))}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shrink-0">
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-12">No positions available yet.</p>}
      </div>
    </div>
  )
}
