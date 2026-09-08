import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

router.post('/jobs', (req, res) => {
  const { skillIds } = req.body
  const companies = JSON.parse(readFileSync(join(__dirname, '../data/companies.json')))

  const allJobs = companies.flatMap(c => c.jobs.map(j => ({ ...j, company: c.name, color: c.color, logo: c.logo })))

  const scored = allJobs.map(job => {
    const matched = job.requiredSkills.filter(s => skillIds.includes(s))
    return { ...job, matchScore: Math.round((matched.length / job.requiredSkills.length) * 100), matchedSkills: matched }
  })

  res.json(scored.sort((a, b) => b.matchScore - a.matchScore))
})

router.post('/courses', (req, res) => {
  const { skillIds } = req.body
  const companies = JSON.parse(readFileSync(join(__dirname, '../data/companies.json')))

  const allCourses = companies.flatMap(c => c.courses.map(co => ({ ...co, company: c.name, color: c.color })))

  const scored = allCourses.map(course => {
    const matched = course.skills.filter(s => skillIds.includes(s))
    return { ...course, matchScore: Math.round((matched.length / course.skills.length) * 100), matchedSkills: matched }
  })

  res.json(scored.sort((a, b) => b.matchScore - a.matchScore))
})

export default router
