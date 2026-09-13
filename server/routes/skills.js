import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { auth } from '../auth.js'

const router = Router()

router.get('/questions', (req, res) => {
  const questions = db.prepare('SELECT q.*, s.name as skill_name FROM questions q JOIN skills s ON q.skill_id = s.id ORDER BY q.rowid').all()
  res.json(questions.map(q => ({ ...q, options: JSON.parse(q.options) })))
})

router.post('/assess', auth, (req, res) => {
  const { answers } = req.body
  const questions = db.prepare('SELECT * FROM questions ORDER BY rowid').all()
  const skills = db.prepare('SELECT * FROM skills').all()

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
  db.prepare('INSERT INTO assessments (id, user_id, answers, profile) VALUES (?,?,?,?)')
    .run(id, req.user.id, JSON.stringify(answers), JSON.stringify(result))

  res.json(result)
})

router.get('/profile', auth, (req, res) => {
  const assessment = db.prepare('SELECT profile FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id)
  if (!assessment) return res.json(null)
  res.json(JSON.parse(assessment.profile))
})

router.get('/', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY category, name').all()
  res.json(skills)
})

export default router
