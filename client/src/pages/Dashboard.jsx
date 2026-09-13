import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import TopNav from '../components/TopNav'

function StatCard({ label, value, change, icon, color }) {
  return (
    <div className="card-elevated" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={color}>{icon}</div>
        {change && <span style={{ fontSize: 12, fontWeight: 600 }} className={change.startsWith('+') ? 'text-green-600' : 'text-red-500'}>{change}</span>}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function StudentDashboard() {
  const [stats, setStats] = useState(null)
  const [apps, setApps] = useState([])

  useEffect(() => { api.getStats().then(setStats); api.getMyApplications().then(setApps) }, [])

  const statusBadge = s => ({
    pending: 'badge-yellow', reviewed: 'badge-blue', shortlisted: 'badge-purple', accepted: 'badge-green', rejected: 'badge-red'
  }[s] || 'badge-gray')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Dashboard" subtitle="Track your applications" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="stats-4">
          <StatCard label="Total Applied" value={stats?.total || 0} color="bg-blue-50 text-blue-600" change="+3"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>} />
          <StatCard label="Pending Review" value={stats?.pending || 0} color="bg-amber-50 text-amber-600"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />
          <StatCard label="Accepted" value={stats?.accepted || 0} color="bg-green-50 text-green-600" change="+1"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>} />
          <StatCard label="Rejected" value={stats?.rejected || 0} color="bg-red-50 text-red-500"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>} />
        </div>

        <div className="card-elevated">
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Application History</h2>
          </div>
          {apps.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <p style={{ color: '#64748b', marginBottom: 16 }}>No applications yet.</p>
              <Link to="/student/recommend" className="btn-primary" style={{ fontSize: 13 }}>Browse Positions</Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hide-mobile">
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 2fr 2fr 1fr', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Position</div><div>Organization</div><div>Match</div><div>Status</div><div style={{ textAlign: 'right' }}>Type</div>
                </div>
                {apps.map((app) => (
                  <div key={app.id} style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 2fr 2fr 1fr', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}>
                    <div style={{ fontWeight: 500, color: '#0f172a', fontSize: 14 }}>{app.job_title}</div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>{app.org_name}</div>
                    <div><span style={{ fontSize: 14, fontWeight: 600, color: app.match_score >= 70 ? '#16a34a' : app.match_score >= 40 ? '#d97706' : '#64748b' }}>{app.match_score}%</span></div>
                    <div><span className={`badge ${statusBadge(app.status)} capitalize`} style={{ fontSize: 10 }}>{app.status}</span></div>
                    <div style={{ textAlign: 'right', fontSize: 14, color: '#64748b' }}>{app.job_type}</div>
                  </div>
                ))}
              </div>
              {/* Mobile cards */}
              <div className="show-mobile-only" style={{ padding: 16 }}>
                {apps.map((app) => (
                  <div key={app.id} style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{app.job_title}</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{app.org_name}</div>
                      </div>
                      <span className={`badge ${statusBadge(app.status)} capitalize`} style={{ fontSize: 10 }}>{app.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#64748b' }}>
                      <span>Match: <strong style={{ color: app.match_score >= 70 ? '#16a34a' : app.match_score >= 40 ? '#d97706' : '#64748b' }}>{app.match_score}%</strong></span>
                      <span>{app.job_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJob, setNewJob] = useState({ title: '', type: 'Internship', description: '', required_skills: [], stipend: '', duration: '', location: '' })
  const [skills, setSkills] = useState([])

  useEffect(() => { api.getStats().then(setStats); api.getMyJobs().then(setJobs); api.getSkills().then(setSkills) }, [])
  useEffect(() => { if (selectedJob) api.getJobApplications(selectedJob.id).then(setApplications) }, [selectedJob])

  const createJob = async (e) => { e.preventDefault(); await api.createJob(newJob); setShowNewJob(false); api.getMyJobs().then(setJobs) }
  const updateStatus = async (appId, status) => { await api.updateApplicationStatus(appId, status); if (selectedJob) api.getJobApplications(selectedJob.id).then(setApplications) }
  const toggleSkill = (skillId) => { setNewJob(p => ({ ...p, required_skills: p.required_skills.includes(skillId) ? p.required_skills.filter(s => s !== skillId) : [...p.required_skills, skillId] })) }

  if (user?.role === 'student') return <StudentDashboard />

  const pipelineData = [stats?.pending || 0, 5, 3, 2, 1]
  const pipelineLabels = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected']

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Dashboard" subtitle="Manage postings and applicants" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }} className="stats-3">
          <StatCard label="Active Postings" value={stats?.jobs || 0} color="bg-blue-50 text-blue-600"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>} />
          <StatCard label="Total Applications" value={stats?.total || 0} color="bg-purple-50 text-purple-600" change="+8"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /></svg>} />
          <StatCard label="Pending Review" value={stats?.pending || 0} color="bg-amber-50 text-amber-600"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />
        </div>

        {/* Pipeline */}
        <div className="card-elevated" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Application Pipeline</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {pipelineData.map((v, i) => {
              const h = v > 0 ? Math.max(20, (v / Math.max(...pipelineData)) * 100) : 4
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>{v}</span>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${h}%`, background: i === 0 ? '#2563eb' : i === 1 ? '#7c3aed' : i === 2 ? '#d97706' : i === 3 ? '#16a34a' : '#dc2626' }} />
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>{pipelineLabels[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Job list + applicants */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }} className="org-main-grid">
          <div>
            <div className="card-elevated">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Postings</h3>
                <button onClick={() => setShowNewJob(true)} className="btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>+ New</button>
              </div>
              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {jobs.map(job => (
                  <button key={job.id} onClick={() => setSelectedJob(job)}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', borderBottom: '1px solid #f1f5f9', background: selectedJob?.id === job.id ? '#eff6ff' : 'transparent', cursor: 'pointer', borderLeft: selectedJob?.id === job.id ? '3px solid #2563eb' : '3px solid transparent' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{job.type} · {job.duration}</div>
                  </button>
                ))}
                {jobs.length === 0 && <p style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', padding: 32 }}>No postings yet</p>}
              </div>
            </div>
          </div>
          <div>
            <div className="card-elevated">
              {selectedJob ? (
                <>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Applicants — {selectedJob.title}</h3>
                  </div>
                  {applications.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><p style={{ color: '#64748b' }}>No applications yet</p></div>
                  ) : (
                    <>
                      <div className="hide-mobile" style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 2fr 3fr', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div>Applicant</div><div>Institution</div><div>Match</div><div>Status</div>
                      </div>
                      {applications.map((app) => (
                        <div key={app.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                          <div className="hide-mobile" style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 2fr 3fr', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 500, color: '#0f172a', fontSize: 14 }}>{app.student_name}</div>
                              <div style={{ fontSize: 12, color: '#64748b' }}>{app.student_email}</div>
                            </div>
                            <div style={{ fontSize: 14, color: '#64748b' }}>{app.institution || '—'}</div>
                            <div><span style={{ fontSize: 14, fontWeight: 700, color: app.match_score >= 70 ? '#16a34a' : app.match_score >= 40 ? '#d97706' : '#64748b' }}>{app.match_score}%</span></div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                                <button key={s} onClick={() => updateStatus(app.id, s)}
                                  style={{ fontSize: 10, fontWeight: 600, padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', background: app.status === s ? '#0f172a' : '#f1f5f9', color: app.status === s ? '#fff' : '#64748b' }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Mobile applicant card */}
                          <div className="show-mobile-only">
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14, marginBottom: 2 }}>{app.student_name}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{app.institution || '—'} · {app.match_score}% match</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                                <button key={s} onClick={() => updateStatus(app.id, s)}
                                  style={{ fontSize: 10, fontWeight: 600, padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', background: app.status === s ? '#0f172a' : '#f1f5f9', color: app.status === s ? '#fff' : '#64748b' }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div style={{ padding: 48, textAlign: 'center' }}><p style={{ color: '#64748b' }}>Select a posting to view applicants</p></div>
              )}
            </div>
          </div>
        </div>

        {/* New Job Modal */}
        {showNewJob && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }} onClick={() => setShowNewJob(false)}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, width: '100%', maxWidth: 512, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>New Job Posting</h2>
              <form onSubmit={createJob} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Title</label>
                  <input placeholder="e.g. Clinical Research Intern" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} required className="input" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="form-2col">
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Type</label>
                    <select value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))} className="input">
                      <option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Duration</label>
                    <input placeholder="e.g. 3 months" value={newJob.duration} onChange={e => setNewJob(p => ({ ...p, duration: e.target.value }))} className="input" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Description</label>
                  <textarea placeholder="Role responsibilities..." value={newJob.description} onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))} className="input" style={{ height: 96, resize: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Stipend</label>
                  <input placeholder="e.g. ₹15,000/month" value={newJob.stipend} onChange={e => setNewJob(p => ({ ...p, stipend: e.target.value }))} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>Required Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {skills.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                        style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 6, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', borderColor: newJob.required_skills.includes(s.id) ? '#2563eb' : '#e2e8f0', background: newJob.required_skills.includes(s.id) ? '#2563eb' : '#fff', color: newJob.required_skills.includes(s.id) ? '#fff' : '#334155' }}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                  <button type="button" onClick={() => setShowNewJob(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Posting</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-4 { grid-template-columns: 1fr 1fr !important; }
          .stats-3 { grid-template-columns: 1fr !important; }
          .org-main-grid { grid-template-columns: 1fr !important; }
          .form-2col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
          .show-mobile-only { display: block !important; }
        }
        @media (min-width: 641px) {
          .show-mobile-only { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .stats-4 { grid-template-columns: 1fr 1fr !important; }
          .stats-3 { grid-template-columns: 1fr 1fr !important; }
          .org-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
