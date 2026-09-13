import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import applicationsRouter from './routes/applications.js'
import skillsRouter from './routes/skills.js'
import miscRouter from './routes/misc.js'
import { seed } from './seed.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(join(__dirname, '../uploads')))

app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/skills', skillsRouter)
app.use('/api', miscRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

seed()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
