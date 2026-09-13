import { useAuth } from '../context/AuthContext'

const typeBadge = { Internship: 'badge-blue', 'Full-time': 'badge-green', 'Part-time': 'badge-yellow', Contract: 'badge-purple' }

export default function JobDetailModal({ job, onClose, onApply, applied }) {
  if (!job) return null
  const { user } = useAuth()

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{job.org_name?.[0] || 'H'}</div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{job.title}</h2>
                <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{job.org_name}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Meta */}
        <div style={{ padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          <span className={`badge ${typeBadge[job.type] || 'badge-gray'}`}>{job.type}</span>
          <span className="badge badge-gray">{job.duration || 'Flexible'}</span>
          <span className="badge badge-gray">{job.stipend || 'Unpaid'}</span>
          {job.location && <span className="badge badge-gray">{job.location}</span>}
        </div>

        {/* Match bar */}
        {job.matchScore != null && job.matchScore > 0 && (
          <div style={{ padding: '0 24px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={job.matchScore >= 70 ? '#16a34a' : '#d97706'} strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Skill Match</span>
                  <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: job.matchScore >= 70 ? '#15803d' : '#b45309' }}>{job.matchScore}%</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${job.matchScore}%`, background: job.matchScore >= 70 ? '#16a34a' : '#d97706' }} /></div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ padding: '0 24px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Description</h3>
          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description || 'No description provided.'}</p>
        </div>

        {/* Skills */}
        <div style={{ padding: '0 24px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Required Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {job.required_skills.map(s => <span key={s} style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 6, background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>{s}</span>)}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="btn-secondary">Close</button>
          {applied ? (
            <span className="badge badge-green" style={{ fontSize: 13, padding: '8px 16px' }}>Applied ✓</span>
          ) : (
            <button onClick={() => { if (!user) return window.location.href = '/login'; onApply?.(job.id) }} className="btn-primary">Apply Now</button>
          )}
        </div>
      </div>
    </div>
  )
}
