import { useState, useEffect } from 'react'
import { api } from '../api'
import TopNav from '../components/TopNav'

const typeBadge = {
  'Faculty Internship': 'badge-blue', 'FDP': 'badge-purple', 'Consultancy': 'badge-green',
  'Workshop': 'badge-yellow', 'Live Project': 'badge-red', 'Research': 'badge-purple'
}

export default function Academician() {
  const [opps, setOpps] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { api.getAcademicOpps().then(setOpps).catch(() => {}) }, [])

  const types = ['All', ...new Set(opps.map(o => o.type))]
  const filtered = opps.filter(o => (filter === 'All' || o.type === filter) && (!search || o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Faculty Portal" subtitle="Fellowships, FDPs & research collaborations" />

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..." className="input pl-9" />
          </div>
          <div className="tab-group">
            {types.map(type => <button key={type} onClick={() => setFilter(type)} className={`tab ${filter === type ? 'tab-active' : ''}`}>{type}</button>)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((opp, i) => (
            <div key={opp.id} className="card-elevated p-5 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${typeBadge[opp.type] || 'badge-gray'}`}>{opp.type}</span>
                <span className="text-xs text-slate-400 font-medium">{opp.duration}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">{opp.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{opp.description}</p>
              <div className="flex flex-wrap gap-1">
                {opp.skills.slice(0, 4).map(s => <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{s}</span>)}
                {opp.skills.length > 4 && <span className="text-[10px] text-slate-400">+{opp.skills.length - 4}</span>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="card-elevated p-12 text-center mt-6"><p className="text-slate-500">No opportunities match your search.</p></div>}
      </div>
    </div>
  )
}
