import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

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

function OppCard({ opp, index }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 hover:bg-white/5 transition-all animate-fade-in-up group" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex items-start justify-between mb-4">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${typeColors[opp.type] || 'bg-gray-800 border-gray-700 text-gray-400'}`}>
          {typeIcons[opp.type]} {opp.type}
        </span>
        <span className="text-sm text-gray-500 font-medium">{opp.duration}</span>
      </div>
      <h3 className="font-bold text-lg text-white mb-2 leading-snug group-hover:text-gradient transition-all">{opp.title}</h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{opp.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {opp.skills.map(s => (
          <span key={s} className="bg-white/5 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/5">{s}</span>
        ))}
      </div>
    </div>
  )
}

export default function Academician() {
  const [opps, setOpps] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => { api.getAcademicOpps().then(setOpps).catch(() => {}) }, [])

  const types = ['All', ...new Set(opps.map(o => o.type))]
  const filtered = filter === 'All' ? opps : opps.filter(o => o.type === filter)

  return (
    <div className="min-h-screen bg-mesh">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-float-delay" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">Faculty Portal</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">Clinical fellowships, FDPs & medical research</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up delay-200">
          {types.map(type => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                filter === type
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'glass border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}>
              {type !== 'All' && <span className="mr-1.5">{typeIcons[type]}</span>}
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((opp, i) => (
            <OppCard key={opp.id} opp={opp} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-4xl mb-4 animate-float">🔬</div>
            <p className="text-gray-400 text-lg">No opportunities found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
