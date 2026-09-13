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

  useEffect(() => { api.getQuestions().then(q => { setQuestions(q); setLoading(false) }).catch(() => setLoading(false)) }, [])

  const handleAnswer = (questionIdx, optionIdx) => {
    setFade(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }))
      if (step < questions.length - 1) setStep(s => s + 1)
      setFade(true)
    }, 150)
  }

  const goBack = () => { if (step > 0) { setFade(false); setTimeout(() => { setStep(s => s - 1); setFade(true) }, 150) } }

  const submit = async () => {
    if (!user) return navigate('/login')
    try {
      const data = await api.assess(questions.map((_, i) => answers[i] ?? 0))
      sessionStorage.setItem('skillProfile', JSON.stringify(data))
      navigate('/student/portfolio')
    } catch (err) { alert('Failed to save: ' + err.message) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, color: '#64748b' }}>Loading assessment…</p>
      </div>
    </div>
  )

  if (!questions.length) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#475569', marginBottom: 16 }}>No questions available.</p>
        <Link to="/" style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}>← Back to home</Link>
      </div>
    </div>
  )

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const answered = Object.keys(answers).length === questions.length

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 12, height: 56 }}>
          <button onClick={goBack} disabled={step === 0}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', opacity: step === 0 ? 0.2 : 1, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div style={{ flex: 1 }}><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{step + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 768, opacity: fade ? 1 : 0, transform: fade ? 'none' : 'translateY(8px)', transition: 'all 0.15s ease' }}>
          <div className="card-elevated" style={{ padding: '20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{q.skill_name}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Question {step + 1} of {questions.length}</span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', marginBottom: 20, lineHeight: 1.5 }}>{q.text}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="assess-options">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(step, i)}
                  style={{ textAlign: 'left', padding: 14, borderRadius: 8, border: `2px solid ${answers[step] === i ? '#2563eb' : '#e2e8f0'}`, background: answers[step] === i ? '#eff6ff' : '#fff', color: answers[step] === i ? '#1e40af' : '#334155', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <span style={{ width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 12, fontWeight: 700, background: answers[step] === i ? '#2563eb' : '#f1f5f9', color: answers[step] === i ? '#fff' : '#64748b', flexShrink: 0 }}>{i + 1}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      {step === questions.length - 1 && answered && (
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderTop: '1px solid #e2e8f0', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#15803d' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            All {questions.length} questions answered
          </div>
          {!user && <p style={{ fontSize: 13, color: '#d97706' }}>Sign in to save your results.</p>}
          <button onClick={submit} className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
            {user ? 'Generate Skill Profile →' : 'Sign In & Generate Profile →'}
          </button>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .assess-options { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
