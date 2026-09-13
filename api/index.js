import express from 'express'
import cors from 'cors'
import { initDB } from '../server/db.js'
import authRouter from '../server/routes/auth.js'
import jobsRouter from '../server/routes/jobs.js'
import applicationsRouter from '../server/routes/applications.js'
import skillsRouter from '../server/routes/skills.js'
import miscRouter from '../server/routes/misc.js'
import { seed } from '../server/seed.js'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/skills', skillsRouter)
app.use('/api', miscRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

let initialized = false

async function ensureInit() {
  if (!initialized) {
    await initDB()
    await seed()
    initialized = true
  }
}

export default async function handler(req, res) {
  await ensureInit()
  return app(req, res)
}

export const config = { api: { bodyParser: false } }
