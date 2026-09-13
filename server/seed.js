import db from './db.js'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function seed() {
  const res = await db.query('SELECT COUNT(*) as c FROM users')
  if (parseInt(res.rows[0].c) > 0) return

  const skills = JSON.parse(readFileSync(join(__dirname, 'data/skills.json')))
  const questions = JSON.parse(readFileSync(join(__dirname, 'data/questions.json')))
  const companies = JSON.parse(readFileSync(join(__dirname, 'data/companies.json')))
  const academicianOpps = JSON.parse(readFileSync(join(__dirname, 'data/academician_opportunities.json')))

  const hash = bcrypt.hashSync('password123', 10)

  // Skills
  for (const s of skills) {
    await db.query('INSERT INTO skills (id, name, category) VALUES ($1,$2,$3)', [s.id, s.name, s.category])
  }

  // Questions
  for (const q of questions) {
    await db.query('INSERT INTO questions (id, text, skill_id, options) VALUES ($1,$2,$3,$4)', [q.id, q.text, q.skillId, JSON.stringify(q.options)])
  }

  // Demo users
  const studentId = uuid()
  const acadId = uuid()

  await db.query('INSERT INTO users (id, name, email, password, role, institution) VALUES ($1,$2,$3,$4,$5,$6)',
    [studentId, 'Priya Sharma', 'priya@demo.com', hash, 'student', 'AIIMS Delhi'])
  await db.query('INSERT INTO users (id, name, email, password, role, institution) VALUES ($1,$2,$3,$4,$5,$6)',
    [acadId, 'Dr. Rajesh Kumar', 'rajesh@demo.com', hash, 'academician', 'JIPMER'])
  await db.query('INSERT INTO users (id, name, email, password, role, institution) VALUES ($1,$2,$3,$4,$5,$6)',
    [uuid(), 'Demo Student 2', 'student2@demo.com', hash, 'student', 'CMC Vellore'])

  // Organizations + jobs + courses
  for (const co of companies) {
    const orgId = uuid()
    await db.query('INSERT INTO users (id, name, email, password, role, institution) VALUES ($1,$2,$3,$4,$5,$6)',
      [orgId, co.name, `${co.name.toLowerCase().replace(/\s+/g, '')}@demo.com`, hash, 'organization', co.name])

    for (const job of co.jobs) {
      await db.query('INSERT INTO job_postings (id, org_id, title, type, description, required_skills, stipend, duration, location) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [job.id, orgId, job.title, job.type, job.description, JSON.stringify(job.requiredSkills), job.stipend, job.duration, 'India'])
    }
    for (const course of co.courses) {
      await db.query('INSERT INTO training_programs (id, org_id, title, skills, description, duration, is_free) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [course.id, orgId, course.title, JSON.stringify(course.skills), course.title, course.duration, course.free ? true : false])
    }
  }

  // Academician opportunities
  for (const opp of academicianOpps) {
    await db.query('INSERT INTO academician_opportunities (id, title, type, skills, duration, description) VALUES ($1,$2,$3,$4,$5,$6)',
      [opp.id, opp.title, opp.type, JSON.stringify(opp.skills), opp.duration, opp.description])
  }

  console.log('Database seeded with demo data')
}
