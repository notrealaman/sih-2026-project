import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
mkdirSync(join(__dirname, '../uploads'), { recursive: true })

const DB_PATH = join(__dirname, '../medbridge.db')
let db

const SQL = await initSqlJs()

if (existsSync(DB_PATH)) {
  const buffer = readFileSync(DB_PATH)
  db = new SQL.Database(buffer)
} else {
  db = new SQL.Database()
}

db.run('PRAGMA foreign_keys = ON')

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    institution TEXT,
    specialization TEXT,
    bio TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)
db.run(`CREATE TABLE IF NOT EXISTS skills (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL)`)
db.run(`CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, text TEXT NOT NULL, skill_id TEXT NOT NULL, options TEXT NOT NULL)`)
db.run(`CREATE TABLE IF NOT EXISTS assessments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, answers TEXT NOT NULL, profile TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS job_postings (id TEXT PRIMARY KEY, org_id TEXT NOT NULL, title TEXT NOT NULL, type TEXT NOT NULL, description TEXT, required_skills TEXT NOT NULL, stipend TEXT, duration TEXT, location TEXT, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS training_programs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL, title TEXT NOT NULL, skills TEXT NOT NULL, description TEXT, duration TEXT, is_free INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, job_id TEXT NOT NULL, status TEXT DEFAULT 'pending', cover_letter TEXT, match_score INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS certificates (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, issuer TEXT, date TEXT, file_path TEXT, verified INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT NOT NULL, read INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
db.run(`CREATE TABLE IF NOT EXISTS academician_opportunities (id TEXT PRIMARY KEY, title TEXT NOT NULL, type TEXT NOT NULL, skills TEXT NOT NULL, duration TEXT, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)

// Save original prepare
const origPrepare = db.prepare.bind(db)

// Wrapper to match better-sqlite3 API
function prepare(sql) {
  return {
    run(...params) {
      db.run(sql, params)
      return { changes: db.getRowsModified() }
    },
    get(...params) {
      const stmt = origPrepare(sql)
      if (params.length) stmt.bind(params)
      const hasRow = stmt.step()
      const r = hasRow ? stmt.getAsObject() : undefined
      stmt.free()
      return r
    },
    all(...params) {
      const stmt = origPrepare(sql)
      if (params.length) stmt.bind(params)
      const rows = []
      while (stmt.step()) rows.push(stmt.getAsObject())
      stmt.free()
      return rows
    }
  }
}

db.prepare = prepare
db.pragma = () => {}
db.transaction = function(fn) {
  return function(...args) {
    db.run('BEGIN TRANSACTION')
    try { const r = fn(...args); db.run('COMMIT'); return r } catch(e) { db.run('ROLLBACK'); throw e }
  }
}

// Save to disk periodically
setInterval(() => {
  const data = db.export()
  writeFileSync(DB_PATH, Buffer.from(data))
}, 5000)

process.on('exit', () => {
  const data = db.export()
  writeFileSync(DB_PATH, Buffer.from(data))
})

export default db
