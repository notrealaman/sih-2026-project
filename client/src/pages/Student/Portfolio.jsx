import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import TopNav from '../../components/TopNav'

function RadarChart({ skills, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 30
  const n = skills.length
  if (n < 3) return null
  const getPoint = (i, level) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = (level / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }
  const gridLevels = [25, 50, 75, 100]
  const skillPoints = skills.map((s, i) => getPoint(i, s.level))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(level => (
        <polygon key={level} points={skills.map((_, i) => { const p = getPoint(i, level); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {skills.map((_, i) => { const p = getPoint(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" /> })}
      <polygon points={skillPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
      {skillPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />)}
      {skills.map((s, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        const lx = cx + (r + 20) * Math.cos(angle)
        const ly = cy + (r + 20) * Math.sin(angle)
        const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle'
        return <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" className="text-[10px] font-medium fill-slate-500">{s.name.length > 12 ? s.name.slice(0, 11) + '…' : s.name}</text>
      })}
    </svg>
  )
}

function SkillRow({ skill, index }) {
  const levelColor = skill.level >= 75 ? 'bg-green-500' : skill.level >= 50 ? 'bg-blue-500' : skill.level >= 25 ? 'bg-amber-500' : 'bg-slate-300'
  const levelBadge = skill.level >= 75 ? 'badge-green' : skill.level >= 50 ? 'badge-blue' : skill.level >= 25 ? 'badge-yellow' : 'badge-gray'
  const levelLabel = skill.level >= 75 ? 'Expert' : skill.level >= 50 ? 'Proficient' : skill.level >= 25 ? 'Learning' : 'Beginner'
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0 animate-slide-up" style={{ animationDelay: `${index * 0.03}s` }}>
      <span className="text-xs font-medium text-slate-400 w-5">{index + 1}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-slate-900">{skill.name}</span>
          <div className="flex items-center gap-2">
            <span className={`badge ${levelBadge} text-[10px]`}>{levelLabel}</span>
            <span className="text-sm font-semibold text-slate-600 tabular-nums w-10 text-right">{skill.level}%</span>
          </div>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${levelColor}`} style={{ width: `${skill.level}%` }} />
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
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Skill Profile" />
      <div className="container py-16 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9l3 3-3 3M15 15h-3" /></svg>
        </div>
        <p className="text-slate-600 font-medium">No clinical profile yet.</p>
        <Link to="/student/assess" className="btn-primary">Take Assessment</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav title="Skill Profile" subtitle="Assessment results and competency mapping" />

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card-elevated p-6">
              <div className="section-header">
                <h2 className="text-base font-semibold text-slate-900">Skill Breakdown</h2>
                <span className="badge badge-gray">{profile.profile.length} skills</span>
              </div>
              <div>{profile.profile.map((skill, i) => <SkillRow key={skill.id} skill={skill} index={i} />)}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-elevated p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Skill Radar</h3>
              <div className="flex justify-center"><RadarChart skills={profile.profile.slice(0, 10)} /></div>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center"><div className="text-2xl font-bold text-slate-900">{profile.profile.length}</div><div className="text-xs text-slate-500 mt-0.5">Skills</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-green-600">{profile.topSkills.length}</div><div className="text-xs text-slate-500 mt-0.5">Strengths</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-amber-600">{profile.gapSkills.length}</div><div className="text-xs text-slate-500 mt-0.5">Gaps</div></div>
              </div>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Strengths</h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {profile.topSkills.length ? profile.topSkills.map(s => <span key={s.id} className="badge badge-green text-[10px]">{s.name}</span>) : <span className="text-xs text-slate-400">None identified</span>}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Gaps</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.gapSkills.length ? profile.gapSkills.map(s => <span key={s.id} className="badge badge-yellow text-[10px]">{s.name}</span>) : <span className="text-xs text-green-600 font-medium">No gaps identified</span>}
              </div>
            </div>
            <Link to="/student/recommend" className="btn-primary w-full justify-center">View Opportunities →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
