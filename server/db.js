import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

function toPg(sql) {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

function prepare(sql) {
  const pgSql = toPg(sql)
  return {
    run(...params) {
      return pool.query(pgSql, params).then(r => ({ changes: r.rowCount }))
    },
    get(...params) {
      return pool.query(pgSql, params).then(r => r.rows[0] || undefined)
    },
    all(...params) {
      return pool.query(pgSql, params).then(r => r.rows)
    }
  }
}

const db = {
  prepare,
  query: (sql, params) => pool.query(toPg(sql), params || [])
}

export async function initDB() {
  const c = await pool.connect()
  try {
    await c.query(`
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
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await c.query(`CREATE TABLE IF NOT EXISTS skills (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL)`)
    await c.query(`CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, text TEXT NOT NULL, skill_id TEXT NOT NULL, options JSONB NOT NULL)`)
    await c.query(`CREATE TABLE IF NOT EXISTS assessments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, answers JSONB NOT NULL, profile JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS job_postings (id TEXT PRIMARY KEY, org_id TEXT NOT NULL, title TEXT NOT NULL, type TEXT NOT NULL, description TEXT, required_skills JSONB NOT NULL, stipend TEXT, duration TEXT, location TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS training_programs (id TEXT PRIMARY KEY, org_id TEXT NOT NULL, title TEXT NOT NULL, skills JSONB NOT NULL, description TEXT, duration TEXT, is_free BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, job_id TEXT NOT NULL, status TEXT DEFAULT 'pending', cover_letter TEXT, match_score INTEGER, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS certificates (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, issuer TEXT, date TEXT, file_path TEXT, verified BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT NOT NULL, read BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW())`)
    await c.query(`CREATE TABLE IF NOT EXISTS academician_opportunities (id TEXT PRIMARY KEY, title TEXT NOT NULL, type TEXT NOT NULL, skills JSONB NOT NULL, duration TEXT, description TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`)
  } finally {
    c.release()
  }
}

export default db
export { pool }
