import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import multer from 'multer'
import { auth } from '../auth.js'
import db from '../db.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const router = Router()

router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ path: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64').slice(0, 50)}...`, originalName: req.file.originalname, size: req.file.size })
})

router.post('/certificates', auth, async (req, res) => {
  const { title, issuer, date, file_path } = req.body
  const id = uuid()
  await db.prepare('INSERT INTO certificates (id, user_id, title, issuer, date, file_path) VALUES ($1,$2,$3,$4,$5,$6)')
    .run(id, req.user.id, title, issuer, date, file_path)
  res.json({ id, title })
})

router.get('/certificates', auth, async (req, res) => {
  const { rows: certs } = await db.prepare('SELECT * FROM certificates WHERE user_id = $1 ORDER BY created_at DESC').all(req.user.id)
  res.json(certs)
})

router.delete('/certificates/:id', auth, async (req, res) => {
  await db.prepare('DELETE FROM certificates WHERE id = $1 AND user_id = $2').run(req.params.id, req.user.id)
  res.json({ success: true })
})

router.get('/notifications', auth, async (req, res) => {
  const { rows: notifs } = await db.prepare('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20').all(req.user.id)
  const { rows } = await db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = $1 AND read = false').all(req.user.id)
  const unread = parseInt(rows[0].c)
  res.json({ notifications: notifs, unread })
})

router.put('/notifications/read', auth, async (req, res) => {
  await db.prepare('UPDATE notifications SET read = true WHERE user_id = $1').run(req.user.id)
  res.json({ success: true })
})

router.get('/analytics', auth, async (req, res) => {
  if (req.user.role === 'organization') {
    const { rows: jobs } = await db.query('SELECT j.*, COUNT(a.id) as app_count FROM job_postings j LEFT JOIN applications a ON j.id = a.job_id WHERE j.org_id = $1 GROUP BY j.id', [req.user.id])

    const { rows: skillDemand } = await db.query(`
      SELECT s.name, COUNT(*) as count
      FROM job_postings j,
      jsonb_array_elements_text(j.required_skills) sk
      JOIN skills s ON s.id = sk
      WHERE j.org_id = $1
      GROUP BY s.name
      ORDER BY count DESC LIMIT 10
    `, [req.user.id])

    const pipeline = {}
    for (const status of ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected']) {
      const { rows } = await db.query('SELECT COUNT(*) as c FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = $1 AND a.status = $2', [req.user.id, status])
      pipeline[status] = parseInt(rows[0].c)
    }

    const { rows: avgRows } = await db.query('SELECT AVG(a.match_score) as avg FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE j.org_id = $1', [req.user.id])
    const avgMatch = parseInt(avgRows[0].avg) || 0

    const { rows: recentApps } = await db.query(`
      SELECT a.*, u.name as student_name, j.title as job_title
      FROM applications a JOIN job_postings j ON a.job_id = j.id JOIN users u ON a.user_id = u.id
      WHERE j.org_id = $1 ORDER BY a.created_at DESC LIMIT 5
    `, [req.user.id])

    res.json({ jobs, skillDemand, pipeline, avgMatch, recentApps })
  } else if (req.user.role === 'student') {
    const { rows: assessRows } = await db.prepare('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1').all(req.user.id)
    const { rows: apps } = await db.query('SELECT a.*, j.title as job_title, j.type as job_type FROM applications a JOIN job_postings j ON a.job_id = j.id WHERE a.user_id = $1 ORDER BY a.created_at DESC', [req.user.id])

    const statusCounts = {}
    apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1 })

    const typeCounts = {}
    apps.forEach(a => { typeCounts[a.job_type] = (typeCounts[a.job_type] || 0) + 1 })

    const timeline = apps.map(a => ({ date: a.created_at, status: a.status, job: a.job_title }))

    res.json({ assessments: assessRows[0] ? 1 : 0, totalApps: apps.length, statusCounts, typeCounts, timeline })
  } else {
    const { rows } = await db.query("SELECT COUNT(*) as c FROM users WHERE role = 'student'")
    const totalStudents = parseInt(rows[0].c)
    const { rows: o } = await db.query("SELECT COUNT(*) as c FROM users WHERE role = 'organization'")
    const totalOrgs = parseInt(o[0].c)
    const { rows: a } = await db.query('SELECT COUNT(*) as c FROM applications')
    const totalApps = parseInt(a[0].c)
    const { rows: j } = await db.query('SELECT COUNT(*) as c FROM job_postings')
    const totalJobs = parseInt(j[0].c)
    const { rows: as } = await db.query('SELECT COUNT(*) as c FROM assessments')
    const totalAssessments = parseInt(as[0].c)

    const { rows: recentUsers } = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5')

    res.json({ totalStudents, totalOrgs, totalApps, totalJobs, totalAssessments, recentUsers })
  }
})

router.get('/export/applications', auth, async (req, res) => {
  if (req.user.role === 'organization') {
    const { rows: apps } = await db.query(`
      SELECT a.*, u.name as student_name, u.email as student_email, u.institution,
             j.title as job_title, j.type as job_type
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN job_postings j ON a.job_id = j.id
      WHERE j.org_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id])

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

router.get('/academician-opportunities', async (req, res) => {
  const { rows: opps } = await db.query('SELECT * FROM academician_opportunities ORDER BY created_at DESC')
  res.json(opps.map(o => ({ ...o, skills: o.skills })))
})

export default router
