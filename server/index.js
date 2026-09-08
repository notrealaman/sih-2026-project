import express from 'express'
import cors from 'cors'
import skillsRouter from './routes/skills.js'
import recommendationsRouter from './routes/recommendations.js'
import opportunitiesRouter from './routes/opportunities.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/skills', skillsRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/opportunities', opportunitiesRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
