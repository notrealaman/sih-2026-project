import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDB } from './db.js'
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import applicationsRouter from './routes/applications.js'
import skillsRouter from './routes/skills.js'
import miscRouter from './routes/misc.js'
import { seed } from './seed.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}))
app.use(express.json())

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, '../uploads')
app.use('/uploads', express.static(UPLOAD_DIR))

app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/skills', skillsRouter)
app.use('/api', miscRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001

initDB().then(() => {
  seed().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  }).catch(err => {
    console.error('Seed failed:', err)
    app.listen(PORT, () => console.log(`Server running (no seed) on http://localhost:${PORT}`))
  })
}).catch(err => {
  console.error('DB init failed:', err)
  process.exit(1)
})
