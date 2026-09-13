import { useState, useEffect } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import TopNav from '../components/TopNav'

export default function Industry() {
  const [jobs, setJobs] = useState([])
  const [applied, setApplied] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    api.getJobs().then(setJobs)
    if (user) api.getMyApplications().then(apps => setApplied(new Set(apps.map(a => a.job_id))))
  }, [user])

  const handleApply = async (jobId) => {
    if (!user) return window.location.href = '/login'
    await api.apply({ job_id: jobId }); setApplied(prev => new Set([...prev, jobId]))
  }

  const types = ['all', ...new Set(jobs.map(j => j.type))]
  const filtered = jobs.filter(j => (filter === 'all' || j.type === filter) && (!search || j.title.toLowerCase().includes(search.toLowerCase()) || j.org_name.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Healthcare Positions" subtitle={`${filtered.length} open roles across healthcare organizations`} />

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions..." className="input pl-9" />
          </div>
          <div className="tab-group">
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'tab-active' : ''}`}>{t === 'all' ? 'All' : t}</button>)}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((job, i) => (
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
                    {job.required_skills.slice(0, 6).map(s => <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{s}</span>)}
                    {job.required_skills.length > 6 && <span className="text-[10px] text-slate-400">+{job.required_skills.length - 6}</span>}
                  </div>
                </div>
                <div className="shrink-0">
                  {applied.has(job.id) ? <span className="badge badge-green text-xs">Applied ✓</span> : <button onClick={() => handleApply(job.id)} className="btn-primary text-sm py-2 px-4">Apply</button>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="card-elevated p-12 text-center"><p className="text-slate-500">No positions match your search.</p></div>}
        </div>
      </div>
    </div>
  )
}
