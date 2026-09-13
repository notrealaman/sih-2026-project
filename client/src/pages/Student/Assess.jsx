import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

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

  const handleAnswer = (questionIdx, optionIdx) => {
    setFade(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }))
      if (step < questions.length - 1) setStep(s => s + 1)
      setFade(true)
    }, 150)
  }

  const goBack = () => {
    if (step > 0) { setFade(false); setTimeout(() => { setStep(s => s - 1); setFade(true) }, 150) }
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading assessment…</p>
      </div>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-600 mb-4">No questions available.</p>
        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">← Back to home</Link>
      </div>
    </div>
  )

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const answered = Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container flex items-center gap-4 h-14">
          <button onClick={goBack} disabled={step === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 disabled:opacity-20 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-sm font-medium text-slate-500 tabular-nums">{step + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl" style={{ opacity: fade ? 1 : 0, transform: fade ? 'none' : 'translateY(8px)', transition: 'all 0.15s ease' }}>
          <div className="card-elevated p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="badge badge-blue">{q.skill_name}</span>
              <span className="text-xs text-slate-400">Question {step + 1} of {questions.length}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">{q.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(step, i)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    answers[step] === i
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  <span className={`inline-flex w-6 h-6 items-center justify-center rounded text-xs font-bold mr-2 ${
                    answers[step] === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
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
        <div className="p-4 sm:p-6 flex flex-col items-center gap-3 animate-slide-up border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            All {questions.length} questions answered
          </div>
          {!user && <p className="text-sm text-amber-600">Sign in to save your results.</p>}
          <button onClick={submit} className="btn-primary px-8 py-3 text-base">
            {user ? 'Generate Skill Profile →' : 'Sign In & Generate Profile →'}
          </button>
        </div>
      )}
    </div>
  )
}
