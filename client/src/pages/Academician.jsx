import { useState, useEffect } from 'react'
import { api } from '../api'
import TopNav from '../components/TopNav'

const wrap = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' }
const typeBadge = { 'Faculty Internship': 'badge-blue', 'FDP': 'badge-purple', 'Consultancy': 'badge-green', 'Workshop': 'badge-yellow', 'Live Project': 'badge-red', 'Research': 'badge-purple' }

export default function Academician() {
  const [opps, setOpps] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { api.getAcademicOpps().then(setOpps).catch(() => {}) }, [])

  const types = ['All', ...new Set(opps.map(o => o.type))]
  const filtered = opps.filter(o => (filter === 'All' || o.type === filter) && (!search || o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase())))

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Faculty Portal" subtitle="Fellowships, FDPs & research collaborations" />

      <div style={{ ...wrap, paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 384 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..." className="input" style={{ paddingLeft: 36 }} />
          </div>
          <div className="tab-group">
            {types.map(type => <button key={type} onClick={() => setFilter(type)} className={`tab ${filter === type ? 'tab-active' : ''}`}>{type}</button>)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {filtered.map((opp, i) => (
            <div key={opp.id} className="card-elevated" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`badge ${typeBadge[opp.type] || 'badge-gray'}`}>{opp.type}</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{opp.duration}</span>
              </div>
              <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>{opp.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{opp.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {opp.skills.slice(0, 4).map(s => <span key={s} style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{s}</span>)}
                {opp.skills.length > 4 && <span style={{ fontSize: 10, color: '#94a3b8' }}>+{opp.skills.length - 4}</span>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="card-elevated" style={{ padding: 48, textAlign: 'center', marginTop: 24 }}><p style={{ color: '#64748b' }}>No opportunities match your search.</p></div>}
      </div>
    </div>
  )
}
