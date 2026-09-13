import { useState, useEffect } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import TopNav from '../components/TopNav'
import JobDetailModal from '../components/JobDetailModal'

export default function Industry() {
  const [jobs, setJobs] = useState([])
  const [applied, setApplied] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Healthcare Positions" subtitle={`${filtered.length} open roles across healthcare organizations`} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>
        {/* Search + filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions..." className="input" style={{ paddingLeft: 36 }} />
          </div>
          <div className="tab-group" style={{ overflow: 'auto', maxWidth: '100%' }}>
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'tab-active' : ''}`}>{t === 'all' ? 'All' : t}</button>)}
          </div>
        </div>

        {/* Job cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((job) => (
            <div key={job.id} className="card-elevated" style={{ padding: 16, cursor: 'pointer', transition: 'border-color 0.15s' }} onClick={() => setSelectedJob(job)}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{job.org_name?.[0] || 'H'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                    <h3 style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{job.title}</h3>
                    <span className="badge badge-gray" style={{ fontSize: 10 }}>{job.type}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{job.org_name} · {job.duration} · {job.stipend}</p>
                  <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {job.required_skills.slice(0, 6).map(s => <span key={s} style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{s}</span>)}
                    {job.required_skills.length > 6 && <span style={{ fontSize: 10, color: '#94a3b8' }}>+{job.required_skills.length - 6}</span>}
                  </div>
                  {/* Mobile apply button */}
                  <div style={{ marginTop: 12 }} className="show-mobile-apply">
                    {applied.has(job.id) ? <span className="badge badge-green" style={{ fontSize: 11 }}>Applied ✓</span> : <button onClick={e => { e.stopPropagation(); handleApply(job.id) }} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>Apply</button>}
                  </div>
                </div>
                {/* Desktop apply */}
                <div style={{ flexShrink: 0 }} className="hide-mobile">
                  {applied.has(job.id) ? <span className="badge badge-green" style={{ fontSize: 12 }}>Applied ✓</span> : <button onClick={e => { e.stopPropagation(); handleApply(job.id) }} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Apply</button>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="card-elevated" style={{ padding: 48, textAlign: 'center' }}><p style={{ color: '#64748b' }}>No positions match your search.</p></div>}
        </div>
      </div>
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={(id) => { handleApply(id); setSelectedJob(null) }} applied={applied.has(selectedJob?.id)} />}
      <style>{`
        @media (min-width: 641px) { .show-mobile-apply { display: none !important; } }
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}
