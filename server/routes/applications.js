import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth, requireRole } from '../auth.js'

const router = Router()

router.post('/', auth, requireRole('student'), async (req, res) => {
  const { job_id, cover_letter } = req.body
  const { rows: jobRows } = await db.prepare('SELECT * FROM job_postings WHERE id = $1').all(job_id)
  const job = jobRows[0]
  if (!job) return res.status(404).json({ error: 'Job not found' })

  const { rows: existRows } = await db.prepare('SELECT id FROM applications WHERE user_id = $1 AND job_id = $2').all(req.user.id, job_id)
  if (existRows[0]) return res.status(409).json({ error: 'Already applied' })

  const { rows: assessRows } = await db.prepare('SELECT profile FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1').all(req.user.id)
  let matchScore = 0
  if (assessRows[0]) {
    const profile = assessRows[0].profile
    const userSkills = profile.filter(s => s.level >= 50).map(s => s.id)
    const required = job.required_skills
    const matched = required.filter(s => userSkills.includes(s))
    matchScore = Math.round((matched.length / required.length) * 100)
  }

  const id = uuid()
  await db.prepare('INSERT INTO applications (id, user_id, job_id, cover_letter, match_score) VALUES ($1,$2,$3,$4,$5)')
    .run(id, req.user.id, job_id, cover_letter || null, matchScore)

  const { rows: studentRows } = await db.prepare('SELECT name FROM users WHERE id = $1').all(req.user.id)
  await db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES ($1,$2,$3,$4,$5)')
    .run(uuid(), job.org_id, 'New Application', `${studentRows[0].name} applied for ${job.title}`, 'application')

  res.json({ id, matchScore, status: 'pending' })
})

router.get('/mine', auth, requireRole('student'), async (req, res) => {
  const { rows: apps } = await db.query(`
    SELECT a.*, j.title as job_title, j.type as job_type, j.stipend, j.duration,
           u.name as org_name
    FROM applications a
    JOIN job_postings j ON a.job_id = j.id
    JOIN users u ON j.org_id = u.id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
  `, [req.user.id])
  res.json(apps)
})

router.get('/job/:jobId', auth, requireRole('organization'), async (req, res) => {
  const { rows: apps } = await db.query(`
    SELECT a.*, u.name as student_name, u.email as student_email,
           u.institution, u.specialization
    FROM applications a
    JOIN users u ON a.user_id = u.id
    WHERE a.job_id = $1
    ORDER BY a.match_score DESC
  `, [req.params.jobId])
  res.json(apps)
})

router.put('/:id/status', auth, requireRole('organization'), async (req, res) => {
  const { status } = req.body
  const { rows } = await db.query(`
    SELECT a.*, j.title as job_title FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE a.id = $1 AND j.org_id = $2
  `, [req.params.id, req.user.id])
  const app = rows[0]
  if (!app) return res.status(404).json({ error: 'Not found' })

  await db.prepare('UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2').run(status, req.params.id)

  await db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES ($1,$2,$3,$4,$5)')
    .run(uuid(), app.user_id, 'Application Update', `Your application for ${app.job_title} has been ${status}`, 'application_update')

  res.json({ success: true })
})

router.get('/stats', auth, async (req, res) => {
  if (req.user.role === 'student') {
    const { rows } = await db.query("SELECT COUNT(*) as c FROM applications WHERE user_id = $1", [req.user.id])
    const total = parseInt(rows[0].c)
    const { rows: p } = await db.query("SELECT COUNT(*) as c FROM applications WHERE user_id = $1 AND status = 'pending'", [req.user.id])
    const pending = parseInt(p[0].c)
    const { rows: a } = await db.query("SELECT COUNT(*) as c FROM applications WHERE user_id = $1 AND status = 'accepted'", [req.user.id])
    const accepted = parseInt(a[0].c)
    res.json({ total, pending, accepted, rejected: total - pending - accepted })
  } else if (req.user.role === 'organization') {
    const { rows } = await db.query('SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = $1', [req.user.id])
    const total = parseInt(rows[0].c)
    const { rows: p } = await db.query("SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = $1 AND a.status = 'pending'", [req.user.id])
    const pending = parseInt(p[0].c)
    const { rows: j } = await db.query('SELECT COUNT(*) as c FROM job_postings WHERE org_id = $1', [req.user.id])
    const jobs = parseInt(j[0].c)
    res.json({ total, pending, jobs })
  } else {
    const { rows } = await db.query("SELECT COUNT(*) as c FROM users WHERE role = 'student'")
    const totalStudents = parseInt(rows[0].c)
    const { rows: o } = await db.query("SELECT COUNT(*) as c FROM users WHERE role = 'organization'")
    const totalOrgs = parseInt(o[0].c)
    const { rows: a } = await db.query('SELECT COUNT(*) as c FROM applications')
    const totalApps = parseInt(a[0].c)
    const { rows: j } = await db.query('SELECT COUNT(*) as c FROM job_postings')
    const totalJobs = parseInt(j[0].c)
    res.json({ totalStudents, totalOrgs, totalApps, totalJobs })
  }
})

export default router
