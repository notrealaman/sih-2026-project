import { useState, useEffect } from 'react'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import TopNav from '../../components/TopNav'

function MatchBar({ score }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-slate-300'
  const textColor = score >= 70 ? 'text-green-700' : score >= 40 ? 'text-amber-700' : 'text-slate-500'
  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1"><div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: `${score}%` }} /></div></div>
      <span className={`text-sm font-bold tabular-nums ${textColor} w-10 text-right`}>{score}%</span>
    </div>
  )
}

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [applied, setApplied] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const { user } = useAuth()

  useEffect(() => {
    api.getJobs().then(allJobs => {
      const data = sessionStorage.getItem('skillProfile')
      if (data) {
        const p = JSON.parse(data); setProfile(p)
        const userSkills = p.profile.filter(s => s.level >= 50).map(s => s.id)
        setJobs(allJobs.map(j => {
          const matched = j.required_skills.filter(s => userSkills.includes(s))
          return { ...j, matchScore: Math.round((matched.length / j.required_skills.length) * 100) }
        }).sort((a, b) => b.matchScore - a.matchScore))
      } else { setJobs(allJobs.map(j => ({ ...j, matchScore: 0 }))) }
    })
    if (user) api.getMyApplications().then(apps => setApplied(new Set(apps.map(a => a.job_id))))
  }, [user])

  const handleApply = async (jobId) => {
    if (!user) return window.location.href = '/login'
    await api.apply({ job_id: jobId }); setApplied(prev => new Set([...prev, jobId]))
  }

  const types = ['all', ...new Set(jobs.map(j => j.type))]
  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.type === filter)
  const sorted = sortBy === 'match' ? filtered : [...filtered].sort((a, b) => a.title.localeCompare(b.title))

  if (!profile) return (
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Opportunities" />
      <div className="container py-16 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </div>
        <p className="text-slate-600 font-medium">Complete the assessment to see matched positions.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Opportunities" subtitle={`${jobs.length} positions ranked by skill compatibility`} />

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="tab-group">
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'tab-active' : ''}`}>{t === 'all' ? 'All' : t}</button>)}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input w-auto text-sm py-1.5 px-3">
            <option value="match">Sort by Match</option><option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="space-y-3">
          {sorted.map((job, i) => (
            <div key={job.id} className="card-elevated p-5 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">{job.org_name?.[0] || 'H'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <span className="badge badge-gray text-[10px]">{job.type}</span>
                  </div>
                  <p className="text-sm text-slate-500">{job.org_name} · {job.duration} · {job.stipend}</p>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{job.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.required_skills.slice(0, 5).map(s => <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{s}</span>)}
                    {job.required_skills.length > 5 && <span className="text-[10px] text-slate-400">+{job.required_skills.length - 5}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <MatchBar score={job.matchScore} />
                  {applied.has(job.id) ? <span className="badge badge-green text-xs">Applied ✓</span> : <button onClick={() => handleApply(job.id)} className="btn-primary text-sm py-2 px-4">Apply</button>}
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="card-elevated p-12 text-center"><p className="text-slate-500">No positions match the current filter.</p></div>}
        </div>
      </div>
    </div>
  )
}
