import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCompanies } from '../data/mock'

export default function Industry() {
  const [companies, setCompanies] = useState([])

  useEffect(() => { setCompanies(getCompanies()) }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydjJoLTZ2Mmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Industry Portal</h1>
          <p className="text-white/60">Post opportunities and discover talent</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        {companies.map((company, ci) => (
          <div key={company.id} className="bg-gray-900 rounded-3xl p-5 sm:p-8 border border-gray-800 animate-fade-in-up"
            style={{ animationDelay: `${ci * 0.1}s` }}>
            {/* Company header */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg"
                style={{ backgroundColor: company.color }}>{company.logo}</div>
              <div>
                <h2 className="text-xl font-bold text-white">{company.name}</h2>
                <p className="text-gray-400 text-sm">{company.industry}</p>
              </div>
            </div>

            {/* Jobs */}
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-lg">💼</span> Open Positions
              <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">{company.jobs.length}</span>
            </h3>
            <div className="space-y-3 mb-6 sm:mb-8">
              {company.jobs.map(job => (
                <div key={job.id} className="bg-gray-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-700/50 hover:border-gray-600 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{job.title}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{job.type} · {job.duration} · {job.stipend}</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shrink-0">
                    View Applicants
                  </button>
                </div>
              ))}
            </div>

            {/* Courses */}
            {company.courses.length > 0 && (
              <>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">📚</span> Learning Programs
                  <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">{company.courses.length}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.courses.map(c => (
                    <div key={c.id} className="bg-gray-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-700/50">
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{c.title}</p>
                        <p className="text-gray-400 text-sm">{c.duration}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${c.free ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-gray-800 border border-gray-700 text-gray-400'}`}>
                        {c.free ? 'FREE' : 'PAID'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
