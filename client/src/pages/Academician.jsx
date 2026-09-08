import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAcademicianOpps } from '../data/mock'

const typeColors = {
  'Faculty Internship': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'FDP': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'Consultancy': 'bg-green-500/10 border-green-500/20 text-green-400',
  'Workshop': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  'Live Project': 'bg-red-500/10 border-red-500/20 text-red-400',
  'Research': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
}
const typeIcons = {
  'Faculty Internship': '🎓', 'FDP': '📚', 'Consultancy': '🤝',
  'Workshop': '🔧', 'Live Project': '🚀', 'Research': '🔬'
}

export default function Academician() {
  const [opps, setOpps] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => { setOpps(getAcademicianOpps()) }, [])

  const types = ['All', ...new Set(opps.map(o => o.type))]
  const filtered = filter === 'All' ? opps : opps.filter(o => o.type === filter)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydjJoLTZ2Mmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Academician Portal</h1>
          <p className="text-white/60">Faculty development, research & industry collaboration</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map(type => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                filter === type
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
              }`}>
              {type !== 'All' && <span className="mr-1.5">{typeIcons[type]}</span>}
              {type}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((opp, i) => (
            <div key={opp.id} className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${typeColors[opp.type] || 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                  {typeIcons[opp.type]} {opp.type}
                </span>
                <span className="text-sm text-gray-500 font-medium">{opp.duration}</span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2 leading-snug">{opp.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{opp.description}</p>
              <div className="flex flex-wrap gap-2">
                {opp.skills.map(s => (
                  <span key={s} className="bg-gray-800 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-700/50">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
