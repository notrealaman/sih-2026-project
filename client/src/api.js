const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const token = sessionStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  // Skills
  getQuestions: () => request('/skills/questions'),
  assess: (answers) => request('/skills/assess', { method: 'POST', body: JSON.stringify({ answers }) }),
  getSkills: () => request('/skills'),
  getSkillProfile: () => request('/skills/profile'),

  // Jobs
  getJobs: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/jobs${q ? '?' + q : ''}`) },
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id, data) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getMyJobs: () => request('/jobs/org/mine'),

  // Applications
  apply: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => request('/applications/mine'),
  getJobApplications: (jobId) => request(`/applications/job/${jobId}`),
  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getStats: () => request('/applications/stats'),

  // Misc
  getNotifications: () => request('/notifications'),
  markNotificationsRead: () => request('/notifications/read', { method: 'PUT' }),
  getAnalytics: () => request('/analytics'),
  getAcademicOpps: () => request('/academician-opportunities'),

  // File upload
  upload: async (file) => {
    const token = sessionStorage.getItem('token')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
    return res.json()
  },
  addCertificate: (data) => request('/certificates', { method: 'POST', body: JSON.stringify(data) }),
  getCertificates: () => request('/certificates'),
  deleteCertificate: (id) => request(`/certificates/${id}`, { method: 'DELETE' })
}
