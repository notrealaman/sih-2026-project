import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Portfolio() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('skillProfile')
    if (data) setProfile(JSON.parse(data))
  }, [])

  if (!profile) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center text-4xl">📊</div>
      <p className="text-xl text-gray-400 text-center">No clinical profile yet. Take the assessment first.</p>
      <Link to="/student/assess" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">
        Start Assessment
      </Link>
    </div>
  )

  const levelLabel = l => l >= 75 ? 'Expert' : l >= 50 ? 'Proficient' : l >= 25 ? 'Learning' : 'Beginner'
  const levelColor = l => l >= 75 ? 'from-green-400 to-emerald-500' : l >= 50 ? 'from-blue-400 to-indigo-500' : l >= 25 ? 'from-yellow-400 to-orange-500' : 'from-gray-500 to-gray-600'
  const levelBg = l => l >= 75 ? 'bg-green-500/10 border-green-500/20 text-green-400' : l >= 50 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : l >= 25 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydjJoLTZ2Mmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">My Clinical Profile</h1>
          <p className="text-white/60">Your skill assessment results</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 -mt-4">
        {/* Skills list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            Skill Profile
          </h2>
          {profile.profile.map((skill, i) => (
            <div key={skill.id} className="bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-800 hover:border-gray-700 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 w-6">{i + 1}</span>
                  <span className="font-semibold text-white">{skill.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelBg(skill.level)}`}>
                    {levelLabel(skill.level)}
                  </span>
                  <span className="text-sm font-bold text-gray-400 w-10 text-right">{skill.level}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${levelColor(skill.level)} transition-all duration-700`}
                  style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Strengths */}
          <div className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span> Top Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.topSkills.length ? profile.topSkills.map(s => (
                <span key={s.id} className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold px-3 py-1.5 rounded-xl">
                  {s.name}
                </span>
              )) : <p className="text-gray-500 text-sm">None yet — keep learning!</p>}
            </div>
          </div>

          {/* Gaps */}
          <div className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">!</span> Skill Gaps
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.gapSkills.length ? profile.gapSkills.map(s => (
                <span key={s.id} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold px-3 py-1.5 rounded-xl">
                  {s.name}
                </span>
              )) : <p className="text-green-400 text-sm font-medium">No major gaps — impressive!</p>}
            </div>
          </div>

          {/* CTA */}
          <Link to="/student/recommend"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/25">
            View Recommendations →
          </Link>

          <Link to="/"
            className="block bg-gray-900 text-gray-400 text-center py-3 rounded-2xl font-medium hover:text-white hover:bg-gray-800 transition-all border border-gray-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
