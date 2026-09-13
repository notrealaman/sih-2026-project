import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth, requireRole } from '../auth.js'

const router = Router()

router.post('/', auth, requireRole('student'), (req, res) => {
  const { job_id, cover_letter } = req.body
  const job = db.prepare('SELECT * FROM job_postings WHERE id = ?').get(job_id)
  if (!job) return res.status(404).json({ error: 'Job not found' })

  const existing = db.prepare('SELECT id FROM applications WHERE user_id = ? AND job_id = ?').get(req.user.id, job_id)
  if (existing) return res.status(409).json({ error: 'Already applied' })

  // Calculate match score from latest assessment
  const assessment = db.prepare('SELECT profile FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id)
  let matchScore = 0
  if (assessment) {
    const profile = JSON.parse(assessment.profile)
    const userSkills = profile.filter(s => s.level >= 50).map(s => s.id)
    const required = JSON.parse(job.required_skills)
    const matched = required.filter(s => userSkills.includes(s))
    matchScore = Math.round((matched.length / required.length) * 100)
  }

  const id = uuid()
  db.prepare('INSERT INTO applications (id, user_id, job_id, cover_letter, match_score) VALUES (?,?,?,?,?)')
    .run(id, req.user.id, job_id, cover_letter || null, matchScore)

  // Notify org
  const student = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id)
  db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?,?,?,?,?)')
    .run(uuid(), job.org_id, 'New Application', `${student.name} applied for ${job.title}`, 'application')

  res.json({ id, matchScore, status: 'pending' })
})

router.get('/mine', auth, requireRole('student'), (req, res) => {
  const apps = db.prepare(`
    SELECT a.*, j.title as job_title, j.type as job_type, j.stipend, j.duration,
           u.name as org_name
    FROM applications a
    JOIN job_postings j ON a.job_id = j.id
    JOIN users u ON j.org_id = u.id
    WHERE a.user_id = ?
    ORDER BY a.created_at DESC
  `).all(req.user.id)
  res.json(apps)
})

router.get('/job/:jobId', auth, requireRole('organization'), (req, res) => {
  const apps = db.prepare(`
    SELECT a.*, u.name as student_name, u.email as student_email,
           u.institution, u.specialization
    FROM applications a
    JOIN users u ON a.user_id = u.id
    WHERE a.job_id = ?
    ORDER BY a.match_score DESC
  `).all(req.params.jobId)
  res.json(apps)
})

router.put('/:id/status', auth, requireRole('organization'), (req, res) => {
  const { status } = req.body
  const app = db.prepare('SELECT a.*, j.title as job_title FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE a.id = ? AND j.org_id = ?').get(req.params.id, req.user.id)
  if (!app) return res.status(404).json({ error: 'Not found' })

  db.prepare('UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id)

  // Notify student
  db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?,?,?,?,?)')
    .run(uuid(), app.user_id, 'Application Update', `Your application for ${app.job_title} has been ${status}`, 'application_update')

  res.json({ success: true })
})

router.get('/stats', auth, (req, res) => {
  if (req.user.role === 'student') {
    const total = db.prepare('SELECT COUNT(*) as c FROM applications WHERE user_id = ?').get(req.user.id).c
    const pending = db.prepare("SELECT COUNT(*) as c FROM applications WHERE user_id = ? AND status = 'pending'").get(req.user.id).c
    const accepted = db.prepare("SELECT COUNT(*) as c FROM applications WHERE user_id = ? AND status = 'accepted'").get(req.user.id).c
    res.json({ total, pending, accepted, rejected: total - pending - accepted })
  } else if (req.user.role === 'organization') {
    const total = db.prepare('SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = ?').get(req.user.id).c
    const pending = db.prepare("SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = ? AND a.status = 'pending'").get(req.user.id).c
    const jobs = db.prepare('SELECT COUNT(*) as c FROM job_postings WHERE org_id = ?').get(req.user.id).c
    res.json({ total, pending, jobs })
  } else {
    const totalStudents = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student'").get().c
    const totalOrgs = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'organization'").get().c
    const totalApps = db.prepare('SELECT COUNT(*) as c FROM applications').get().c
    const totalJobs = db.prepare('SELECT COUNT(*) as c FROM job_postings').get().c
    res.json({ totalStudents, totalOrgs, totalApps, totalJobs })
  }
})

export default router
