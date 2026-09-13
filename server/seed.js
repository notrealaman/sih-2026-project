import db from './db.js'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c
  if (userCount > 0) return

  const skills = JSON.parse(readFileSync(join(__dirname, 'data/skills.json')))
  const questions = JSON.parse(readFileSync(join(__dirname, 'data/questions.json')))
  const companies = JSON.parse(readFileSync(join(__dirname, 'data/companies.json')))
  const academicianOpps = JSON.parse(readFileSync(join(__dirname, 'data/academician_opportunities.json')))

  const insertSkill = db.prepare('INSERT INTO skills (id, name, category) VALUES (?, ?, ?)')
  const insertQuestion = db.prepare('INSERT INTO questions (id, text, skill_id, options) VALUES (?, ?, ?, ?)')
  const insertUser = db.prepare('INSERT INTO users (id, name, email, password, role, institution) VALUES (?, ?, ?, ?, ?, ?)')
  const insertJob = db.prepare('INSERT INTO job_postings (id, org_id, title, type, description, required_skills, stipend, duration, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const insertCourse = db.prepare('INSERT INTO training_programs (id, org_id, title, skills, description, duration, is_free) VALUES (?, ?, ?, ?, ?, ?, ?)')
  const insertAcademicOpp = db.prepare('INSERT INTO academician_opportunities (id, title, type, skills, duration, description) VALUES (?, ?, ?, ?, ?, ?)')

  const seedAll = db.transaction(() => {
    // Skills
    for (const s of skills) insertSkill.run(s.id, s.name, s.category)

    // Questions
    for (const q of questions) insertQuestion.run(q.id, q.text, q.skillId, JSON.stringify(q.options))

    // Demo users
    const hash = bcrypt.hashSync('password123', 10)
    const studentId = uuid()
    const acadId = uuid()
    const orgIds = []

    insertUser.run(studentId, 'Priya Sharma', 'priya@demo.com', hash, 'student', 'AIIMS Delhi')
    insertUser.run(acadId, 'Dr. Rajesh Kumar', 'rajesh@demo.com', hash, 'academician', 'JIPMER')
    insertUser.run(uuid(), 'Demo Student 2', 'student2@demo.com', hash, 'student', 'CMC Vellore')

    // Organizations + jobs
    for (const co of companies) {
      const orgId = uuid()
      orgIds.push(orgId)
      insertUser.run(orgId, co.name, `${co.name.toLowerCase().replace(/\s+/g, '')}@demo.com`, hash, 'organization', co.name)

      for (const job of co.jobs) {
        insertJob.run(job.id, orgId, job.title, job.type, job.description, JSON.stringify(job.requiredSkills), job.stipend, job.duration, 'India')
      }
      for (const course of co.courses) {
        insertCourse.run(course.id, orgId, course.title, JSON.stringify(course.skills), course.title, course.duration, course.free ? 1 : 0)
      }
    }

    // Academician opportunities
    for (const opp of academicianOpps) {
      insertAcademicOpp.run(opp.id, opp.title, opp.type, JSON.stringify(opp.skills), opp.duration, opp.description)
    }
  })

  seedAll()
  console.log('Database seeded with demo data')
}
