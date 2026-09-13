import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

function PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-64 h-64 rounded-full border border-indigo-500/10 animate-pulse-ring" />
      <div className="absolute w-48 h-48 rounded-full border border-purple-500/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

export default function Assess() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0)
  const [fade, setFade] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    api.getQuestions().then(q => { setQuestions(q); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleAnswer = (qi, val) => {
    setFade(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [qi]: val }))
      if (step < questions.length - 1) setStep(s => s + 1)
      setFade(true)
    }, 200)
  }

  const goBack = () => {
    if (step > 0) { setFade(false); setTimeout(() => { setStep(s => s - 1); setFade(true) }, 200) }
  }

  const submit = async () => {
    if (!user) return navigate('/login')
    try {
      const answerArray = questions.map((_, i) => answers[i] ?? 0)
      const data = await api.assess(answerArray)
      sessionStorage.setItem('skillProfile', JSON.stringify(data))
      navigate('/student/portfolio')
    } catch (err) { alert('Failed to save: ' + err.message) }
  }

  if (loading) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-white font-medium">Loading assessment...</div>
      </div>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">📋</div>
        <div className="text-gray-400 text-lg">No questions available.</div>
        <Link to="/" className="text-indigo-400 text-sm mt-4 inline-block hover:text-indigo-300">← Back home</Link>
      </div>
    </div>
  )

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const answered = Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen bg-mesh flex flex-col relative">
      <PulseRing />

      {/* Top bar */}
      <div className="glass sticky top-0 z-20 px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} disabled={step === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 disabled:opacity-20 hover:bg-white/10 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-bold text-gray-400 w-14 text-right">{step + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
        <div className={`w-full max-w-lg transition-all duration-300 ${fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-6">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{q.skill_name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-snug">{q.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i, i)}
                  className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 ${
                    answers[step] === i
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'border-white/5 hover:border-white/10 text-gray-300 hover:bg-white/5 hover:scale-[1.01]'
                  }`}>
                  <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-bold mr-3 transition-colors ${
                    answers[step] === i ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500'
                  }`}>{i + 1}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      {step === questions.length - 1 && answered && (
        <div className="p-4 sm:p-6 flex flex-col items-center gap-3 animate-fade-in-up relative z-10">
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            All questions answered
          </div>
          {!user && <div className="text-yellow-400 text-sm">Sign in to save your results</div>}
          <button onClick={submit}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-green-500/25 w-full max-w-lg">
            {user ? 'Generate My Skill Profile →' : 'Sign In & Generate Profile →'}
          </button>
        </div>
      )}
    </div>
  )
}
