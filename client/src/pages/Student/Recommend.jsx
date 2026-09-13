import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [tab, setTab] = useState('jobs')
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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center text-4xl">🎯</div>
      <p className="text-xl text-gray-400 text-center">Take the assessment first to see matched positions.</p>
      <Link to="/student/assess" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">Start Assessment</Link>
    </div>
  )

  const matchColor = s => s >= 70 ? 'text-green-400' : s >= 40 ? 'text-yellow-400' : 'text-red-400'
  const matchBg = s => s >= 70 ? 'bg-green-500/10 border-green-500/20' : s >= 40 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Opportunities For You</h1>
          <p className="text-white/60">Matched to your clinical skill profile</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={job.id} className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg">
                  {job.org_name?.[0] || 'H'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate">{job.title}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">{job.org_name} · {job.type} · {job.duration}</p>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{job.description}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                  <div className={`px-4 py-2 rounded-xl border ${matchBg(job.matchScore)}`}>
                    <span className={`text-2xl font-black ${matchColor(job.matchScore)}`}>{job.matchScore}%</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-300">{job.stipend}</span>
                  {applied.has(job.id) ? (
                    <span className="bg-gray-800 text-gray-400 text-xs font-bold px-4 py-2 rounded-xl">Applied</span>
                  ) : (
                    <button onClick={() => handleApply(job.id)}
                      className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors">
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
