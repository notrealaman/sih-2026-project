import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

function SkillBar({ skill, index, levelColor, levelBg, levelLabel }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5 hover:bg-white/5 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-600 w-6">{index + 1}</span>
          <span className="font-semibold text-white">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelBg(skill.level)}`}>{levelLabel(skill.level)}</span>
          <span className="text-sm font-bold text-gray-400 w-10 text-right">{skill.level}%</span>
        </div>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${levelColor(skill.level)} transition-all duration-1000 ease-out`}
          style={{ width: `${skill.level}%`, transitionDelay: `${index * 50}ms` }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon, delay }) {
  return (
    <div className="glass rounded-2xl p-5 animate-scale-in" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
        <div>
          <div className="text-2xl font-black text-white">{value}</div>
          <div className="text-gray-500 text-xs">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [profile, setProfile] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      api.getSkillProfile().then(p => { if (p) setProfile(p) }).catch(() => {})
    } else {
      const data = sessionStorage.getItem('skillProfile')
      if (data) setProfile(JSON.parse(data))
    }
  }, [user])

  if (!profile) return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-6 px-4">
      <svg viewBox="0 0 120 120" className="w-24 h-24 animate-float">
        <circle cx="60" cy="60" r="50" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
        <rect x="35" y="35" width="50" height="50" rx="8" fill="rgba(99,102,241,0.2)" />
        <path d="M50 55 L55 60 L70 45" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="text-xl text-gray-400 text-center">No clinical profile yet.</p>
      <Link to="/student/assess" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
        Take Assessment
      </Link>
    </div>
  )

  const levelLabel = l => l >= 75 ? 'Expert' : l >= 50 ? 'Proficient' : l >= 25 ? 'Learning' : 'Beginner'
  const levelColor = l => l >= 75 ? 'from-green-400 to-emerald-500' : l >= 50 ? 'from-blue-400 to-indigo-500' : l >= 25 ? 'from-yellow-400 to-orange-500' : 'from-gray-500 to-gray-600'
  const levelBg = l => l >= 75 ? 'bg-green-500/10 border-green-500/20 text-green-400' : l >= 50 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : l >= 25 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 animate-fade-in-up">My Clinical Profile</h1>
          <p className="text-white/50 animate-fade-in-up delay-100">Your skill assessment results</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-4">
        {/* Skills */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Skill Profile
          </h2>
          {profile.profile.map((skill, i) => (
            <SkillBar key={skill.id} skill={skill} index={i} levelColor={levelColor} levelBg={levelBg} levelLabel={levelLabel} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <StatCard label="Skills Assessed" value={profile.profile.length} color="bg-indigo-500/10 text-indigo-400" delay={0.1}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>} />
          <StatCard label="Top Strengths" value={profile.topSkills.length} color="bg-green-500/10 text-green-400" delay={0.2}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} />
          <StatCard label="Skill Gaps" value={profile.gapSkills.length} color="bg-orange-500/10 text-orange-400" delay={0.3}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />

          <div className="glass rounded-2xl p-5 animate-fade-in-up delay-400">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-green-400">✓</span> Strengths
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.topSkills.length ? profile.topSkills.map(s => (
                <span key={s.id} className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-lg">{s.name}</span>
              )) : <span className="text-gray-500 text-xs">None yet</span>}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 animate-fade-in-up delay-500">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-orange-400">!</span> Gaps
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.gapSkills.length ? profile.gapSkills.map(s => (
                <span key={s.id} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-lg">{s.name}</span>
              )) : <span className="text-green-400 text-xs font-medium">No gaps!</span>}
            </div>
          </div>

          <Link to="/student/recommend" className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-3.5 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 animate-fade-in-up delay-600">
            View Opportunities →
          </Link>
        </div>
      </div>
    </div>
  )
}
