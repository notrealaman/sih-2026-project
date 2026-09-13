import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import multer from 'multer'
import { auth } from '../auth.js'
import db from '../db.js'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: join(__dirname, '../uploads'),
  filename: (req, file, cb) => cb(null, `${uuid()}${extname(file.originalname)}`)
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

const router = Router()

router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ path: `/uploads/${req.file.filename}`, originalName: req.file.originalname, size: req.file.size })
})

router.post('/certificates', auth, (req, res) => {
  const { title, issuer, date, file_path } = req.body
  const id = uuid()
  db.prepare('INSERT INTO certificates (id, user_id, title, issuer, date, file_path) VALUES (?,?,?,?,?,?)')
    .run(id, req.user.id, title, issuer, date, file_path)
  res.json({ id, title })
})

router.get('/certificates', auth, (req, res) => {
  const certs = db.prepare('SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json(certs)
})

router.delete('/certificates/:id', auth, (req, res) => {
  db.prepare('DELETE FROM certificates WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.json({ success: true })
})

router.get('/notifications', auth, (req, res) => {
  const notifs = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(req.user.id)
  const unread = db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND read = 0').get(req.user.id).c
  res.json({ notifications: notifs, unread })
})

router.put('/notifications/read', auth, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id)
  res.json({ success: true })
})

router.get('/analytics', auth, (req, res) => {
  if (req.user.role === 'organization') {
    const jobs = db.prepare('SELECT j.*, COUNT(a.id) as app_count FROM job_postings j LEFT JOIN applications a ON j.id = a.job_id WHERE j.org_id = ? GROUP BY j.id').all(req.user.id)
    const skillDemand = db.prepare(`SELECT s.name, COUNT(*) as count FROM job_postings j, json_each(j.required_skills) sk JOIN skills s ON s.id = json_each.value WHERE j.org_id = ? GROUP BY s.name ORDER BY count DESC LIMIT 10`).all(req.user.id)

    const pipeline = {}
    ;['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].forEach(status => {
      pipeline[status] = db.prepare(`SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = ? AND a.status = ?`).get(req.user.id, status).c
    })

    const avgMatch = db.prepare(`SELECT AVG(a.match_score) as avg FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = ?`).get(req.user.id).avg || 0

    const recentApps = db.prepare(`
      SELECT a.*, u.name as student_name, j.title as job_title
      FROM applications a JOIN job_postings j ON a.job_id = j.id JOIN users u ON a.user_id = u.id
      WHERE j.org_id = ? ORDER BY a.created_at DESC LIMIT 5
    `).all(req.user.id)

    res.json({ jobs, skillDemand, pipeline, avgMatch: Math.round(avgMatch), recentApps })
  } else if (req.user.role === 'student') {
    const assessments = db.prepare('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id)
    const apps = db.prepare('SELECT a.*, j.title as job_title, j.type as job_type FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE a.user_id = ? ORDER BY a.created_at DESC').all(req.user.id)

    const statusCounts = {}
    apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1 })

    const typeCounts = {}
    apps.forEach(a => { typeCounts[a.job_type] = (typeCounts[a.job_type] || 0) + 1 })

    const timeline = apps.map(a => ({ date: a.created_at, status: a.status, job: a.job_title }))

    res.json({ assessments: assessments ? 1 : 0, totalApps: apps.length, statusCounts, typeCounts, timeline })
  } else {
    const totalStudents = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student'").get().c
    const totalOrgs = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'organization'").get().c
    const totalApps = db.prepare('SELECT COUNT(*) as c FROM applications').get().c
    const totalJobs = db.prepare('SELECT COUNT(*) as c FROM job_postings').get().c
    const totalAssessments = db.prepare('SELECT COUNT(*) as c FROM assessments').get().c

    const recentUsers = db.prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5").all()

    res.json({ totalStudents, totalOrgs, totalApps, totalJobs, totalAssessments, recentUsers })
  }
})

router.get('/export/applications', auth, (req, res) => {
  if (req.user.role === 'organization') {
    const apps = db.prepare(`
      SELECT a.*, u.name as student_name, u.email as student_email, u.institution,
             j.title as job_title, j.type as job_type
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN job_postings j ON a.job_id = j.id
      WHERE j.org_id = ?
      ORDER BY a.created_at DESC
    `).all(req.user.id)

    const header = 'Student,Email,Institution,Job,Type,Match,Status,Applied\n'
    const csv = header + apps.map(a =>
      `"${a.student_name}","${a.student_email}","${a.institution || ''}","${a.job_title}","${a.job_type}",${a.match_score},${a.status},"${a.created_at}"`
    ).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv')
    res.send(csv)
  } else {
    res.status(403).json({ error: 'Organization only' })
  }
})

router.get('/academician-opportunities', (req, res) => {
  const opps = db.prepare('SELECT * FROM academician_opportunities ORDER BY created_at DESC').all()
  res.json(opps.map(o => ({ ...o, skills: JSON.parse(o.skills) })))
})

export default router
