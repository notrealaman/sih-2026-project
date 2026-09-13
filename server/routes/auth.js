import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { generateToken, auth } from '../auth.js'

const router = Router()

router.post('/register', (req, res) => {
  const { name, email, password, role, institution, phone, specialization } = req.body
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' })

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const id = uuid()
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('INSERT INTO users (id, name, email, password, role, institution, phone, specialization) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, name, email, hash, role, institution || null, phone || null, specialization || null)

  const user = { id, name, email, role }
  const token = generateToken(user)

  // Welcome notification
  db.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?,?,?,?,?)')
    .run(uuid(), id, 'Welcome to MedBridge!', 'Your account has been created successfully.', 'welcome')

  res.json({ user, token })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const { password: _, ...safe } = user
  res.json({ user: safe, token: generateToken(safe) })
})

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, phone, institution, specialization, bio, avatar, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.put('/me', auth, (req, res) => {
  const { name, phone, institution, specialization, bio } = req.body
  db.prepare('UPDATE users SET name=COALESCE(?,name), phone=COALESCE(?,phone), institution=COALESCE(?,institution), specialization=COALESCE(?,specialization), bio=COALESCE(?,bio) WHERE id=?')
    .run(name, phone, institution, specialization, bio, req.user.id)
  const user = db.prepare('SELECT id, name, email, role, phone, institution, specialization, bio FROM users WHERE id = ?').get(req.user.id)
  res.json(user)
})

export default router
