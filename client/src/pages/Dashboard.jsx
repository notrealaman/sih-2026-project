import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import TopNav from '../components/TopNav'

function StatCard({ label, value, change, icon, color }) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        {change && <span className={`text-xs font-semibold ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change}</span>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label mt-1">{label}</div>
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
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Dashboard" subtitle="Track your applications" />

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Application History</h2>
          </div>
          {apps.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">No applications yet.</p>
              <Link to="/student/recommend" className="btn-primary text-sm">Browse Positions</Link>
            </div>
          ) : (
            <>
              <div className="table-header grid-cols-12">
                <div className="col-span-4">Position</div>
                <div className="col-span-3">Organization</div>
                <div className="col-span-2">Match</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Type</div>
              </div>
              {apps.map((app, i) => (
                <div key={app.id} className="table-row grid-cols-12 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className="col-span-4">
                    <div className="font-medium text-slate-900 text-sm">{app.job_title}</div>
                  </div>
                  <div className="col-span-3 text-sm text-slate-500">{app.org_name}</div>
                  <div className="col-span-2">
                    <span className={`text-sm font-semibold ${app.match_score >= 70 ? 'text-green-600' : app.match_score >= 40 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {app.match_score}%
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`badge ${statusBadge(app.status)} capitalize text-[10px]`}>{app.status}</span>
                  </div>
                  <div className="col-span-1 text-right text-sm text-slate-500">{app.job_type}</div>
                </div>
              ))}
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
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Dashboard" subtitle="Manage postings and applicants" />

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Active Postings" value={stats?.jobs || 0} color="bg-blue-50 text-blue-600"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>} />
          <StatCard label="Total Applications" value={stats?.total || 0} color="bg-purple-50 text-purple-600" change="+8"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /></svg>} />
          <StatCard label="Pending Review" value={stats?.pending || 0} color="bg-amber-50 text-amber-600"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />
        </div>

        <div className="card-elevated p-6 mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Application Pipeline</h3>
          <div className="flex items-end gap-3 h-32">
            {pipelineData.map((v, i) => {
              const h = v > 0 ? Math.max(20, (v / Math.max(...pipelineData)) * 100) : 4
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">{v}</span>
                  <div className="w-full rounded-t" style={{ height: `${h}%`, background: i === 0 ? '#2563eb' : i === 1 ? '#7c3aed' : i === 2 ? '#d97706' : i === 3 ? '#16a34a' : '#dc2626' }} />
                  <span className="text-[10px] text-slate-500 font-medium">{pipelineLabels[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card-elevated">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Postings</h3>
                <button onClick={() => setShowNewJob(true)} className="btn-primary text-xs py-1.5 px-3">+ New</button>
              </div>
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {jobs.map(job => (
                  <button key={job.id} onClick={() => setSelectedJob(job)}
                    className={`w-full text-left px-4 py-3 transition-all hover:bg-slate-50 ${
                      selectedJob?.id === job.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                    }`}>
                    <div className="text-sm font-medium text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{job.type} · {job.duration}</div>
                  </button>
                ))}
                {jobs.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No postings yet</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-elevated">
              {selectedJob ? (
                <>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Applicants — {selectedJob.title}</h3>
                  </div>
                  {applications.length === 0 ? (
                    <div className="p-12 text-center"><p className="text-slate-500">No applications yet</p></div>
                  ) : (
                    <>
                      <div className="table-header grid-cols-12">
                        <div className="col-span-4">Applicant</div>
                        <div className="col-span-3">Institution</div>
                        <div className="col-span-2">Match</div>
                        <div className="col-span-3">Status</div>
                      </div>
                      {applications.map((app, i) => (
                        <div key={app.id} className="table-row grid-cols-12 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
                          <div className="col-span-4">
                            <div className="font-medium text-slate-900 text-sm">{app.student_name}</div>
                            <div className="text-xs text-slate-500">{app.student_email}</div>
                          </div>
                          <div className="col-span-3 text-sm text-slate-500">{app.institution || '—'}</div>
                          <div className="col-span-2">
                            <span className={`text-sm font-bold ${app.match_score >= 70 ? 'text-green-600' : app.match_score >= 40 ? 'text-amber-600' : 'text-slate-500'}`}>
                              {app.match_score}%
                            </span>
                          </div>
                          <div className="col-span-3">
                            <div className="flex flex-wrap gap-1">
                              {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                                <button key={s} onClick={() => updateStatus(app.id, s)}
                                  className={`text-[10px] font-semibold px-2 py-1 rounded transition-all ${
                                    app.status === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}>
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
                <div className="p-12 text-center">
                  <p className="text-slate-500">Select a posting to view applicants</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showNewJob && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewJob(false)}>
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-slate-900 mb-5">New Job Posting</h2>
              <form onSubmit={createJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                  <input placeholder="e.g. Clinical Research Intern" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} required className="input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                    <select value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))} className="input">
                      <option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                    <input placeholder="e.g. 3 months" value={newJob.duration} onChange={e => setNewJob(p => ({ ...p, duration: e.target.value }))} className="input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea placeholder="Role responsibilities and requirements..." value={newJob.description} onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))} className="input h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stipend</label>
                  <input placeholder="e.g. ₹15,000/month" value={newJob.stipend} onChange={e => setNewJob(p => ({ ...p, stipend: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills</label>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-all ${
                          newJob.required_skills.includes(s.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNewJob(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">Create Posting</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
