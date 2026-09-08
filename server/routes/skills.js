import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

router.get('/', (req, res) => {
  const skills = JSON.parse(readFileSync(join(__dirname, '../data/skills.json')))
  res.json(skills)
})

router.get('/questions', (req, res) => {
  const questions = JSON.parse(readFileSync(join(__dirname, '../data/questions.json')))
  const skills = JSON.parse(readFileSync(join(__dirname, '../data/skills.json')))
  const enriched = questions.map(q => ({
    ...q,
    skillName: skills.find(s => s.id === q.skillId)?.name
  }))
  res.json(enriched)
})

router.post('/assess', (req, res) => {
  const { answers } = req.body
  const skills = JSON.parse(readFileSync(join(__dirname, '../data/skills.json')))
  const questions = JSON.parse(readFileSync(join(__dirname, '../data/questions.json')))

  const scores = {}
  questions.forEach((q, i) => {
    const answer = answers[i] || 0
    const level = (answer / 3) * 100
    const skill = skills.find(s => s.id === q.skillId)
    if (skill) {
      scores[skill.id] = { ...skill, level: Math.round(level) }
    }
  })

  const profile = Object.values(scores).sort((a, b) => b.level - a.level)
  res.json({ profile, topSkills: profile.filter(s => s.level >= 66), gapSkills: profile.filter(s => s.level < 50) })
})

export default router
