import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { generateToken, auth } from '../auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password, role, institution, phone, specialization } = req.body
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' })

  const existing = await db.prepare('SELECT id FROM users WHERE email = $1').get(email)
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const id = uuid()
  const hash = bcrypt.hashSync(password, 10)
  await db.prepare('INSERT INTO users (id, name, email, password, role, institution, phone, specialization) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)')
    .run(id, name, email, hash, role, institution || null, phone || null, specialization || null)

  const user = { id, name, email, role }
  const token = generateToken(user)

  await db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES ($1,$2,$3,$4,$5)')
    .run(uuid(), id, 'Welcome to MedBridge!', 'Your account has been created successfully.', 'welcome')

  res.json({ user, token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await db.prepare('SELECT * FROM users WHERE email = $1').get(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const { password: _, ...safe } = user
  res.json({ user: safe, token: generateToken(safe) })
})

router.get('/me', auth, async (req, res) => {
  const user = await db.prepare('SELECT id, name, email, role, phone, institution, specialization, bio, avatar, created_at FROM users WHERE id = $1').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.put('/me', auth, async (req, res) => {
  const { name, phone, institution, specialization, bio } = req.body
  await db.prepare('UPDATE users SET name=COALESCE($1,name), phone=COALESCE($2,phone), institution=COALESCE($3,institution), specialization=COALESCE($4,specialization), bio=COALESCE($5,bio) WHERE id=$6')
    .run(name, phone, institution, specialization, bio, req.user.id)
  const user = await db.prepare('SELECT id, name, email, role, phone, institution, specialization, bio FROM users WHERE id = $1').get(req.user.id)
  res.json(user)
})

export default router
