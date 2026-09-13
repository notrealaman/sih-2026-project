import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import TopNav from '../../components/TopNav'

const wrap = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' }

function RadarChart({ skills, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 30
  const n = skills.length
  if (n < 3) return null
  const getPoint = (i, level) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return { x: cx + (level / 100) * r * Math.cos(angle), y: cy + (level / 100) * r * Math.sin(angle) }
  }
  const skillPoints = skills.map((s, i) => getPoint(i, s.level))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25, 50, 75, 100].map(level => (
        <polygon key={level} points={skills.map((_, i) => { const p = getPoint(i, level); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {skills.map((_, i) => { const p = getPoint(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" /> })}
      <polygon points={skillPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
      {skillPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />)}
      {skills.map((s, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        const lx = cx + (r + 20) * Math.cos(angle)
        const ly = cy + (r + 20) * Math.sin(angle)
        return <text key={i} x={lx} y={ly} textAnchor={lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle'} dominantBaseline="middle" style={{ fontSize: 10, fontWeight: 500, fill: '#64748b' }}>{s.name.length > 12 ? s.name.slice(0, 11) + '…' : s.name}</text>
      })}
    </svg>
  )
}

function SkillRow({ skill, index }) {
  const color = skill.level >= 75 ? '#16a34a' : skill.level >= 50 ? '#2563eb' : skill.level >= 25 ? '#d97706' : '#cbd5e1'
  const badge = skill.level >= 75 ? 'badge-green' : skill.level >= 50 ? 'badge-blue' : skill.level >= 25 ? 'badge-yellow' : 'badge-gray'
  const label = skill.level >= 75 ? 'Expert' : skill.level >= 50 ? 'Proficient' : skill.level >= 25 ? 'Learning' : 'Beginner'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', width: 20 }}>{index + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{skill.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge ${badge}`} style={{ fontSize: 10 }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#475569', fontVariantNumeric: 'tabular-nums', width: 40, textAlign: 'right' }}>{skill.level}%</span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${skill.level}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [profile, setProfile] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) { api.getSkillProfile().then(p => { if (p) setProfile(p) }).catch(() => {}) }
    else { const data = sessionStorage.getItem('skillProfile'); if (data) setProfile(JSON.parse(data)) }
  }, [user])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Skill Profile" />
      <div style={{ ...wrap, paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9l3 3-3 3M15 15h-3" /></svg>
        </div>
        <p style={{ color: '#475569', fontWeight: 500 }}>No clinical profile yet.</p>
        <Link to="/student/assess" className="btn-primary">Take Assessment</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav title="Skill Profile" subtitle="Assessment results and competency mapping" />

      <div style={{ ...wrap, paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <div className="card-elevated" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Skill Breakdown</h2>
                <span className="badge badge-gray">{profile.profile.length} skills</span>
              </div>
              <div>{profile.profile.map((skill, i) => <SkillRow key={skill.id} skill={skill} index={i} />)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card-elevated" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Skill Radar</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}><RadarChart skills={profile.profile.slice(0, 10)} /></div>
            </div>
            <div className="card-elevated" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{profile.profile.length}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Skills</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{profile.topSkills.length}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Strengths</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{profile.gapSkills.length}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Gaps</div></div>
              </div>
            </div>
            <div className="card-elevated" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Strengths</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {profile.topSkills.length ? profile.topSkills.map(s => <span key={s.id} className="badge badge-green" style={{ fontSize: 10 }}>{s.name}</span>) : <span style={{ fontSize: 12, color: '#94a3b8' }}>None identified</span>}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Gaps</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.gapSkills.length ? profile.gapSkills.map(s => <span key={s.id} className="badge badge-yellow" style={{ fontSize: 10 }}>{s.name}</span>) : <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>No gaps identified</span>}
              </div>
            </div>
            <Link to="/student/recommend" className="btn-primary" style={{ justifyContent: 'center' }}>View Opportunities →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
