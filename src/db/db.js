// Simple SQLite wrapper using better-sqlite3 with lightweight migrations
const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')

const dataDir = path.join(__dirname, '..', '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const dbPath = path.join(dataDir, 'peoplecore.db')

let db

function init() {
  db = new Database(dbPath)
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  db.exec(schema)

  // lightweight migration: add new columns if missing
  const cols = db.prepare("PRAGMA table_info('employees')").all().map(r => r.name)
  const addIfMissing = (colDef) => {
    const name = colDef.split(' ')[0]
    if (!cols.includes(name)) {
      db.exec(`ALTER TABLE employees ADD COLUMN ${colDef}`)
    }
  }

  addIfMissing('photo_thumbnail_path TEXT')
  addIfMissing('department TEXT')
  addIfMissing('employee_code TEXT')
}

function getAllEmployees() {
  const stmt = db.prepare('SELECT * FROM employees ORDER BY surname, forename')
  return stmt.all()
}

function getEmployee(id) {
  const stmt = db.prepare('SELECT * FROM employees WHERE id = ?')
  return stmt.get(id)
}

function addEmployee(payload) {
  const fields = Object.keys(payload)
  const cols = fields.join(', ')
  const placeholders = fields.map(() => '?').join(', ')
  const stmt = db.prepare(`INSERT INTO employees (${cols}) VALUES (${placeholders})`)
  const info = stmt.run(...fields.map(f => payload[f]))
  return { id: info.lastInsertRowid }
}

function updateEmployee(id, payload) {
  const fields = Object.keys(payload)
  const assignments = fields.map(f => `${f} = ?`).join(', ')
  const stmt = db.prepare(`UPDATE employees SET ${assignments} WHERE id = ?`)
  const info = stmt.run(...fields.map(f => payload[f]), id)
  return { changes: info.changes }
}

function deleteEmployee(id) {
  const stmt = db.prepare('DELETE FROM employees WHERE id = ?')
  const info = stmt.run(id)
  return { changes: info.changes }
}

module.exports = { init, getAllEmployees, getEmployee, addEmployee, updateEmployee, deleteEmployee }
