import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

function StatCard({ label, value, color, delay, icon }) {
  return (
    <div className="glass rounded-2xl p-5 animate-scale-in" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
        <div>
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-gray-500 text-xs">{label}</div>
        </div>
      </div>
    </div>
  )
}

function StudentDashboard() {
  const [stats, setStats] = useState(null)
  const [apps, setApps] = useState([])

  useEffect(() => { api.getStats().then(setStats); api.getMyApplications().then(setApps) }, [])

  const statusColor = s => ({
    pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    reviewed: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    shortlisted: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    accepted: 'bg-green-500/10 border-green-500/20 text-green-400',
    rejected: 'bg-red-500/10 border-red-500/20 text-red-400'
  }[s] || 'bg-gray-500/10 border-gray-500/20 text-gray-400')

  return (
    <div className="min-h-screen bg-mesh">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">My Applications</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">Track your job applications and their status</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Applied" value={stats.total} color="bg-blue-500/10 text-blue-400" delay={0.1}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>} />
            <StatCard label="Pending" value={stats.pending} color="bg-yellow-500/10 text-yellow-400" delay={0.2}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />
            <StatCard label="Accepted" value={stats.accepted} color="bg-green-500/10 text-green-400" delay={0.3}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>} />
          </div>
        )}

        <div className="space-y-3">
          {apps.map((app, i) => (
            <div key={app.id} className="glass rounded-2xl p-5 hover:bg-white/5 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-white font-bold shrink-0">
                  {app.org_name?.[0] || 'H'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{app.job_title}</h3>
                  <p className="text-gray-400 text-sm">{app.org_name} · {app.job_type} · {app.stipend}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className={`text-xl font-black ${app.match_score >= 70 ? 'text-green-400' : app.match_score >= 40 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {app.match_score}%
                    </div>
                    <div className="text-gray-600 text-[10px]">match</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${statusColor(app.status)}`}>{app.status}</span>
                </div>
              </div>
            </div>
          ))}
          {apps.length === 0 && (
            <div className="text-center py-16 glass rounded-2xl">
              <div className="text-4xl mb-4 animate-float">🔍</div>
              <p className="text-gray-400 text-lg mb-4">No applications yet.</p>
              <Link to="/student/recommend" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity">
                Browse Positions
              </Link>
            </div>
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

  useEffect(() => {
    api.getStats().then(setStats)
    api.getMyJobs().then(setJobs)
    api.getSkills().then(setSkills)
  }, [])

  useEffect(() => {
    if (selectedJob) api.getJobApplications(selectedJob.id).then(setApplications)
  }, [selectedJob])

  const createJob = async (e) => {
    e.preventDefault()
    await api.createJob(newJob)
    setShowNewJob(false)
    api.getMyJobs().then(setJobs)
  }

  const updateStatus = async (appId, status) => {
    await api.updateApplicationStatus(appId, status)
    if (selectedJob) api.getJobApplications(selectedJob.id).then(setApplications)
  }

  const toggleSkill = (skillId) => {
    setNewJob(p => ({ ...p, required_skills: p.required_skills.includes(skillId) ? p.required_skills.filter(s => s !== skillId) : [...p.required_skills, skillId] }))
  }

  if (user?.role === 'student') return <StudentDashboard />

  return (
    <div className="min-h-screen bg-mesh">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20" />
        <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">{user?.name || 'Dashboard'}</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">Manage job postings and applicants</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Active Jobs" value={stats.jobs} color="bg-emerald-500/10 text-emerald-400" delay={0.1}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>} />
            <StatCard label="Applications" value={stats.total} color="bg-blue-500/10 text-blue-400" delay={0.2}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><path d="M15 2H9v2h6V2z" /></svg>} />
            <StatCard label="Pending Review" value={stats.pending} color="bg-yellow-500/10 text-yellow-400" delay={0.3}
              icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-white">Job Postings</h2>
              <button onClick={() => setShowNewJob(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20">
                + New
              </button>
            </div>
            {jobs.map((job, i) => (
              <button key={job.id} onClick={() => setSelectedJob(job)}
                className={`w-full text-left glass rounded-xl p-4 transition-all animate-fade-in-up ${
                  selectedJob?.id === job.id ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:bg-white/5'
                }`} style={{ animationDelay: `${i * 0.05}s` }}>
                <p className="font-semibold text-white text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-1">{job.type} · {job.duration}</p>
              </button>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 text-sm text-center py-8 glass rounded-xl">No job postings yet</p>}
          </div>

          <div className="lg:col-span-2">
            {selectedJob ? (
              <div>
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Applicants for: {selectedJob.title}
                </h2>
                {applications.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl">
                    <div className="text-4xl mb-4 animate-float">📋</div>
                    <p className="text-gray-400">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app, i) => (
                      <div key={app.id} className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-white">{app.student_name}</p>
                            <p className="text-gray-400 text-sm">{app.institution} · {app.specialization || 'Not specified'}</p>
                            <p className="text-gray-500 text-xs mt-1">{app.student_email}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className={`text-2xl font-black ${app.match_score >= 70 ? 'text-green-400' : app.match_score >= 40 ? 'text-yellow-400' : 'text-gray-500'}`}>
                              {app.match_score}%
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                            <button key={s} onClick={() => updateStatus(app.id, s)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                app.status === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                              }`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <div className="text-4xl mb-4 animate-float">👈</div>
                <p className="text-gray-400">Select a job posting to view applicants</p>
              </div>
            )}
          </div>
        </div>

        {showNewJob && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowNewJob(false)}>
            <div className="glass rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">New Job Posting</h2>
              <form onSubmit={createJob} className="space-y-4">
                <input placeholder="Job Title" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                <select value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  <option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option>
                </select>
                <textarea placeholder="Description" value={newJob.description} onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 h-24 resize-none" />
                <div className="flex gap-3">
                  <input placeholder="Stipend" value={newJob.stipend} onChange={e => setNewJob(p => ({ ...p, stipend: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                  <input placeholder="Duration" value={newJob.duration} onChange={e => setNewJob(p => ({ ...p, duration: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          newJob.required_skills.includes(s.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                        }`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNewJob(false)} className="flex-1 bg-white/5 text-gray-400 py-3 rounded-xl font-bold hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
