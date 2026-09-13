import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleAnswer = (qi, val) => {
    setFade(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [qi]: val }))
      if (step < questions.length - 1) setStep(step + 1)
      setFade(true)
    }, 150)
  }

  const goBack = () => {
    if (step > 0) { setFade(false); setTimeout(() => { setStep(step - 1); setFade(true) }, 150) }
  }

  const submit = async () => {
    if (!user) return navigate('/login')
    const answerArray = questions.map((_, i) => answers[i] ?? 0)
    const data = await api.assess(answerArray)
    sessionStorage.setItem('skillProfile', JSON.stringify(data))
    navigate('/student/portfolio')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-lg animate-pulse">Loading questions...</div>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 text-lg">No questions available.</div>
    </div>
  )

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const answered = Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={goBack} disabled={step === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 disabled:opacity-20 hover:bg-gray-700 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-400 w-12 text-right">{step + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className={`w-full max-w-lg transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-6">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{q.skill_name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-snug">{q.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i, i)}
                  className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 ${
                    answers[step] === i
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'border-gray-700 hover:border-gray-500 text-gray-300 hover:bg-gray-800'
                  }`}>
                  <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-bold mr-3 ${
                    answers[step] === i ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500'
                  }`}>{i + 1}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {step === questions.length - 1 && answered && (
        <div className="p-4 sm:p-6 flex justify-center animate-fade-in-up">
          <button onClick={submit}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-green-500/25">
            Generate My Skill Profile →
          </button>
        </div>
      )}
    </div>
  )
}
