import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

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

  if (user?.role === 'student') {
    return <StudentDashboard />
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl font-black text-white">{user?.name || 'Dashboard'}</h1>
          <p className="text-white/60 mt-1">Manage your job postings and applicants</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active Jobs', value: stats.jobs, color: 'text-emerald-400' },
              { label: 'Total Applications', value: stats.total, color: 'text-blue-400' },
              { label: 'Pending Review', value: stats.pending, color: 'text-yellow-400' }
            ].map(s => (
              <div key={s.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs list */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-white">Your Job Postings</h2>
              <button onClick={() => setShowNewJob(true)} className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500">+ New</button>
            </div>
            {jobs.map(job => (
              <button key={job.id} onClick={() => setSelectedJob(job)}
                className={`w-full text-left bg-gray-900 rounded-xl p-4 border transition-all ${selectedJob?.id === job.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-800 hover:border-gray-700'}`}>
                <p className="font-semibold text-white text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-1">{job.type} · {job.duration}</p>
              </button>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No job postings yet</p>}
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div>
                <h2 className="font-bold text-white mb-4">Applicants for: {selectedJob.title}</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-12">No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-white">{app.student_name}</p>
                            <p className="text-gray-400 text-sm">{app.institution} · {app.specialization || 'Not specified'}</p>
                            <p className="text-gray-500 text-xs mt-1">{app.student_email}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-black ${app.match_score >= 70 ? 'text-green-400' : app.match_score >= 40 ? 'text-yellow-400' : 'text-gray-500'}`}>
                              {app.match_score}%
                            </div>
                            <p className="text-xs text-gray-500">match</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
                            <button key={s} onClick={() => updateStatus(app.id, s)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${app.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
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
              <div className="text-center py-16 text-gray-500">Select a job posting to view applicants</div>
            )}
          </div>
        </div>

        {/* New job modal */}
        {showNewJob && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowNewJob(false)}>
            <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-gray-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">New Job Posting</h2>
              <form onSubmit={createJob} className="space-y-4">
                <input placeholder="Job Title" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                <select value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  <option>Internship</option><option>Full-time</option><option>Part-time</option><option>Contract</option>
                </select>
                <textarea placeholder="Description" value={newJob.description} onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-24" />
                <div className="flex gap-3">
                  <input placeholder="Stipend" value={newJob.stipend} onChange={e => setNewJob(p => ({ ...p, stipend: e.target.value }))}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                  <input placeholder="Duration" value={newJob.duration} onChange={e => setNewJob(p => ({ ...p, duration: e.target.value }))}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${newJob.required_skills.includes(s.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNewJob(false)} className="flex-1 bg-gray-800 text-gray-400 py-3 rounded-xl font-bold hover:text-white">Cancel</button>
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StudentDashboard() {
  const [stats, setStats] = useState(null)
  const [apps, setApps] = useState([])

  useEffect(() => { api.getStats().then(setStats); api.getMyApplications().then(setApps) }, [])

  const statusColor = s => ({ pending: 'text-yellow-400', reviewed: 'text-blue-400', shortlisted: 'text-purple-400', accepted: 'text-green-400', rejected: 'text-red-400' }[s] || 'text-gray-400')

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl font-black text-white">My Applications</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800"><div className="text-3xl font-black text-blue-400">{stats.total}</div><div className="text-gray-400 text-sm">Applied</div></div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800"><div className="text-3xl font-black text-yellow-400">{stats.pending}</div><div className="text-gray-400 text-sm">Pending</div></div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800"><div className="text-3xl font-black text-green-400">{stats.accepted}</div><div className="text-gray-400 text-sm">Accepted</div></div>
          </div>
        )}
        <div className="space-y-3">
          {apps.map(app => (
            <div key={app.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{app.job_title}</p>
                <p className="text-gray-400 text-sm">{app.org_name} · {app.job_type} · {app.stipend}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold capitalize ${statusColor(app.status)}`}>{app.status}</span>
                <div className="text-gray-500 text-xs mt-1">{app.match_score}% match</div>
              </div>
            </div>
          ))}
          {apps.length === 0 && <p className="text-gray-500 text-center py-12">No applications yet. <Link to="/student/recommend" className="text-indigo-400">Browse positions</Link></p>}
        </div>
      </div>
    </div>
  )
}
