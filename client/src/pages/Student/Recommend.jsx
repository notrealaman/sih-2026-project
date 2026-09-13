import { useState, useEffect } from 'react'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import TopNav from '../../components/TopNav'
import JobDetailModal from '../../components/JobDetailModal'

const wrap = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' }

function MatchBar({ score }) {
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#cbd5e1'
  const textColor = score >= 70 ? '#15803d' : score >= 40 ? '#b45309' : '#64748b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 140 }}>
      <div style={{ flex: 1 }}><div className="progress-track"><div className="progress-fill" style={{ width: `${score}%`, background: color }} /></div></div>
      <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: textColor, width: 40, textAlign: 'right' }}>{score}%</span>
    </div>
  )
}

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [applied, setApplied] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const [selectedJob, setSelectedJob] = useState(null)
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Opportunities" />
      <div style={{ ...wrap, paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </div>
        <p style={{ color: '#475569', fontWeight: 500 }}>Complete the assessment to see matched positions.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Opportunities" subtitle={`${jobs.length} positions ranked by skill compatibility`} />

      <div style={{ ...wrap, paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div className="tab-group">
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'tab-active' : ''}`}>{t === 'all' ? 'All' : t}</button>)}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input" style={{ width: 'auto', fontSize: 13, padding: '6px 12px' }}>
            <option value="match">Sort by Match</option><option value="name">Sort by Name</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((job, i) => (
            <div key={job.id} className="card-elevated" style={{ padding: 20, cursor: 'pointer', transition: 'border-color 0.15s' }} onClick={() => setSelectedJob(job)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{job.org_name?.[0] || 'H'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{job.title}</h3>
                    <span className="badge badge-gray" style={{ fontSize: 10 }}>{job.type}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#64748b' }}>{job.org_name} · {job.duration} · {job.stipend}</p>
                  <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {job.required_skills.slice(0, 5).map(s => <span key={s} style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{s}</span>)}
                    {job.required_skills.length > 5 && <span style={{ fontSize: 10, color: '#94a3b8' }}>+{job.required_skills.length - 5}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  <MatchBar score={job.matchScore} />
                  {applied.has(job.id) ? <span className="badge badge-green" style={{ fontSize: 12 }}>Applied ✓</span> : <button onClick={e => { e.stopPropagation(); handleApply(job.id) }} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Apply</button>}
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="card-elevated" style={{ padding: 48, textAlign: 'center' }}><p style={{ color: '#64748b' }}>No positions match the current filter.</p></div>}
        </div>
      </div>
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={(id) => { handleApply(id); setSelectedJob(null) }} applied={applied.has(selectedJob?.id)} />}
    </div>
  )
}
