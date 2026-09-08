import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecommendedJobs, getRecommendedCourses } from '../../data/mock'

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [courses, setCourses] = useState([])
  const [tab, setTab] = useState('jobs')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('skillProfile')
    if (!data) return
    const p = JSON.parse(data)
    setProfile(p)
    const skillIds = p.profile.map(s => s.id)
    setJobs(getRecommendedJobs(skillIds))
    setCourses(getRecommendedCourses(skillIds))
  }, [])

  if (!profile) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center text-4xl">🎯</div>
      <p className="text-xl text-gray-400 text-center">Take the assessment first to see recommendations.</p>
      <Link to="/student/assess" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">Start Assessment</Link>
    </div>
  )

  const matchColor = s => s >= 70 ? 'text-green-400' : s >= 40 ? 'text-yellow-400' : 'text-red-400'
  const matchBg = s => s >= 70 ? 'bg-green-500/10 border-green-500/20' : s >= 40 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydjJoLTZ2Mmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Recommendations</h1>
          <p className="text-white/60">Matched to your skill profile</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900 p-1.5 rounded-2xl w-fit border border-gray-800">
          <button onClick={() => setTab('jobs')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'jobs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            💼 Jobs ({jobs.length})
          </button>
          <button onClick={() => setTab('courses')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'courses' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            📚 Courses ({courses.length})
          </button>
        </div>

        {/* Jobs */}
        {tab === 'jobs' && (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={job.id} className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg"
                    style={{ backgroundColor: job.color }}>{job.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate">{job.title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{job.company} · {job.type} · {job.duration}</p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                    <div className={`px-4 py-2 rounded-xl border ${matchBg(job.matchScore)}`}>
                      <span className={`text-2xl font-black ${matchColor(job.matchScore)}`}>{job.matchScore}%</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300">{job.stipend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses */}
        {tab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course, i) => (
              <div key={course.id} className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: course.color }}>{course.company?.[0]}</div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{course.title}</h3>
                    <p className="text-gray-400 text-sm">{course.company} · {course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${matchColor(course.matchScore)}`}>
                    {course.matchScore}% match
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${course.free ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-gray-800 border border-gray-700 text-gray-400'}`}>
                    {course.free ? 'FREE' : 'PAID'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
