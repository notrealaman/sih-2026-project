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
  res.json(notifs)
})

router.put('/notifications/read', auth, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id)
  res.json({ success: true })
})

router.get('/analytics', auth, (req, res) => {
  if (req.user.role === 'organization') {
    const jobs = db.prepare('SELECT j.*, COUNT(a.id) as app_count FROM job_postings j LEFT JOIN applications a ON j.id = a.job_id WHERE j.org_id = ? GROUP BY j.id').all(req.user.id)
    const skillDemand = db.prepare(`SELECT s.name, COUNT(*) as count FROM job_postings j, json_each(j.required_skills) sk JOIN skills s ON s.id = json_each.value WHERE j.org_id = ? GROUP BY s.name ORDER BY count DESC LIMIT 10`).all(req.user.id)
    res.json({ jobs, skillDemand })
  } else {
    const jobTypes = db.prepare('SELECT type, COUNT(*) as count FROM job_postings WHERE is_active = 1 GROUP BY type').all()
    res.json({ jobTypes })
  }
})

router.get('/academician-opportunities', (req, res) => {
  const opps = db.prepare('SELECT * FROM academician_opportunities ORDER BY created_at DESC').all()
  res.json(opps.map(o => ({ ...o, skills: JSON.parse(o.skills) })))
})

export default router
