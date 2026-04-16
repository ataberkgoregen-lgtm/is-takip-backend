const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "jobs.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    job_url TEXT,
    applied_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Beklemede',
    response_type TEXT,
    response_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
