import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth, requireRole } from '../auth.js'

const router = Router()

router.get('/', async (req, res) => {
  const { search, type, skill } = req.query
  let query = "SELECT j.*, u.name as org_name, u.institution as org_institution FROM job_postings j JOIN users u ON j.org_id = u.id WHERE j.is_active = true"
  const params = []
  let i = 0

  if (search) { query += ` AND (j.title ILIKE $${++i} OR j.description ILIKE $${i})`; params.push(`%${search}%`) }
  if (type) { query += ` AND j.type = $${++i}`; params.push(type) }
  if (skill) { query += ` AND j.required_skills::text ILIKE $${++i}`; params.push(`%${skill}%`) }

  query += ' ORDER BY j.created_at DESC'
  const { rows: jobs } = await db.query(query, params)
  res.json(jobs.map(j => ({ ...j, required_skills: j.required_skills })))
})

router.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT j.*, u.name as org_name FROM job_postings j JOIN users u ON j.org_id = u.id WHERE j.id = $1', [req.params.id])
  const job = rows[0]
  if (!job) return res.status(404).json({ error: 'Job not found' })
  res.json({ ...job, required_skills: job.required_skills })
})

router.post('/', auth, requireRole('organization'), async (req, res) => {
  const { title, type, description, required_skills, stipend, duration, location } = req.body
  const id = uuid()
  await db.prepare('INSERT INTO job_postings (id, org_id, title, type, description, required_skills, stipend, duration, location) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)')
    .run(id, req.user.id, title, type, description, JSON.stringify(required_skills), stipend, duration, location)
  res.json({ id, title, type })
})

router.put('/:id', auth, requireRole('organization'), async (req, res) => {
  const { rows } = await db.prepare('SELECT * FROM job_postings WHERE id = $1 AND org_id = $2').all(req.params.id, req.user.id)
  const job = rows[0]
  if (!job) return res.status(404).json({ error: 'Not found' })
  const { title, type, description, required_skills, stipend, duration, location, is_active } = req.body
  await db.prepare('UPDATE job_postings SET title=COALESCE($1,title), type=COALESCE($2,type), description=COALESCE($3,description), required_skills=COALESCE($4,required_skills), stipend=COALESCE($5,stipend), duration=COALESCE($6,duration), location=COALESCE($7,location), is_active=COALESCE($8,is_active) WHERE id=$9')
    .run(title, type, description, required_skills ? JSON.stringify(required_skills) : null, stipend, duration, location, is_active, req.params.id)
  res.json({ success: true })
})

router.get('/org/mine', auth, requireRole('organization'), async (req, res) => {
  const { rows: jobs } = await db.prepare('SELECT * FROM job_postings WHERE org_id = $1 ORDER BY created_at DESC').all(req.user.id)
  res.json(jobs.map(j => ({ ...j, required_skills: j.required_skills })))
})

export default router
