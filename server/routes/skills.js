import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth } from '../auth.js'

const router = Router()

router.get('/questions', async (req, res) => {
  const { rows: questions } = await db.query('SELECT q.*, s.name as skill_name FROM questions q JOIN skills s ON q.skill_id = s.id ORDER BY q.id')
  res.json(questions.map(q => ({ ...q, options: q.options })))
})

router.post('/assess', auth, async (req, res) => {
  const { answers } = req.body
  const { rows: questions } = await db.query('SELECT * FROM questions ORDER BY id')
  const { rows: skills } = await db.query('SELECT * FROM skills')

  const scores = {}
  questions.forEach((q, i) => {
    const answer = answers[i] || 0
    const level = Math.round((answer / 3) * 100)
    const skill = skills.find(s => s.id === q.skill_id)
    if (skill) scores[skill.id] = { id: skill.id, name: skill.name, category: skill.category, level }
  })

  const profile = Object.values(scores).sort((a, b) => b.level - a.level)
  const result = { profile, topSkills: profile.filter(s => s.level >= 66), gapSkills: profile.filter(s => s.level < 50) }

  const id = uuid()
  await db.prepare('INSERT INTO assessments (id, user_id, answers, profile) VALUES ($1,$2,$3,$4)')
    .run(id, req.user.id, JSON.stringify(answers), JSON.stringify(result))

  res.json(result)
})

router.get('/profile', auth, async (req, res) => {
  const { rows } = await db.prepare('SELECT profile FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1').all(req.user.id)
  if (!rows[0]) return res.json(null)
  res.json(rows[0].profile)
})

router.get('/', async (req, res) => {
  const { rows: skills } = await db.query('SELECT * FROM skills ORDER BY category, name')
  res.json(skills)
})

export default router
