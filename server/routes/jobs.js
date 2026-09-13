import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth, requireRole } from '../auth.js'

const router = Router()

router.get('/', (req, res) => {
  const { search, type, skill } = req.query
  let query = 'SELECT j.*, u.name as org_name, u.institution as org_institution FROM job_postings j JOIN users u ON j.org_id = u.id WHERE j.is_active = 1'
  const params = []

  if (search) { query += ' AND (j.title LIKE ? OR j.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  if (type) { query += ' AND j.type = ?'; params.push(type) }
  if (skill) { query += ' AND j.required_skills LIKE ?'; params.push(`%${skill}%`) }

  query += ' ORDER BY j.created_at DESC'
  const jobs = db.prepare(query).all(...params)
  res.json(jobs.map(j => ({ ...j, required_skills: JSON.parse(j.required_skills) })))
})

router.get('/:id', (req, res) => {
  const job = db.prepare('SELECT j.*, u.name as org_name FROM job_postings j JOIN users u ON j.org_id = u.id WHERE j.id = ?').get(req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  res.json({ ...job, required_skills: JSON.parse(job.required_skills) })
})

router.post('/', auth, requireRole('organization'), (req, res) => {
  const { title, type, description, required_skills, stipend, duration, location } = req.body
  const id = uuid()
  db.prepare('INSERT INTO job_postings (id, org_id, title, type, description, required_skills, stipend, duration, location) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, title, type, description, JSON.stringify(required_skills), stipend, duration, location)
  res.json({ id, title, type })
})

router.put('/:id', auth, requireRole('organization'), (req, res) => {
  const job = db.prepare('SELECT * FROM job_postings WHERE id = ? AND org_id = ?').get(req.params.id, req.user.id)
  if (!job) return res.status(404).json({ error: 'Not found' })
  const { title, type, description, required_skills, stipend, duration, location, is_active } = req.body
  db.prepare('UPDATE job_postings SET title=COALESCE(?,title), type=COALESCE(?,type), description=COALESCE(?,description), required_skills=COALESCE(?,required_skills), stipend=COALESCE(?,stipend), duration=COALESCE(?,duration), location=COALESCE(?,location), is_active=COALESCE(?,is_active) WHERE id=?')
    .run(title, type, description, required_skills ? JSON.stringify(required_skills) : null, stipend, duration, location, is_active, req.params.id)
  res.json({ success: true })
})

router.get('/org/mine', auth, requireRole('organization'), (req, res) => {
  const jobs = db.prepare('SELECT * FROM job_postings WHERE org_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json(jobs.map(j => ({ ...j, required_skills: JSON.parse(j.required_skills) })))
})

export default router
