import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

router.get('/companies', (req, res) => {
  const companies = JSON.parse(readFileSync(join(__dirname, '../data/companies.json')))
  res.json(companies)
})

router.get('/academician', (req, res) => {
  const opps = JSON.parse(readFileSync(join(__dirname, '../data/academician_opportunities.json')))
  res.json(opps)
})

export default router
