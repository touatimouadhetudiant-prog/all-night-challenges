import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const DEADLINE = new Date('2026-04-19T07:00:00');
const START_IDEA_SUB = new Date('2026-04-18T017:00:00');
const END_IDEA_SUB = new Date('2026-04-18T020:00:00');
const START_PROJECT_SUB = new Date('2026-04-18T22:00:00');
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB CONNECT ERROR:', err);
  } else {
    console.log('Connected to SQLite DB ✅');
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamName TEXT,
    leaderCin TEXT,
    driveLink TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error('TABLE CREATE ERROR:', err);
    } else {
      console.log('registrations table ready ✅');
    }
  }
);

db.all(`PRAGMA table_info(registrations)`, [], (err, columns) => {
  if (err) {
    console.error('PRAGMA ERROR:', err);
    return;
  }

  const columnNames = columns.map((col) => col.name);

  if (!columnNames.includes('driveLink')) {
    db.run(`ALTER TABLE registrations ADD COLUMN driveLink TEXT`, (alterErr) => {
      if (alterErr) {
        console.error('ADD driveLink COLUMN ERROR:', alterErr);
      } else {
        console.log('driveLink column added ✅');
      }
    });
  }
});

db.run(
  `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_teamName
  ON registrations(LOWER(TRIM(teamName)))
`,
  (err) => {
    if (err) {
      console.error('UNIQUE teamName ERROR:', err);
    } else {
      console.log('Unique teamName ready ✅');
    }
  }
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/registrations', (req, res) => {
  db.all(
    `
    SELECT id, teamName, leaderCin, driveLink, createdAt
    FROM registrations
    ORDER BY id DESC
  `,
    [],
    (err, rows) => {
      if (err) {
        console.error('GET REGISTRATIONS ERROR:', err);
        return res.status(500).json({ message: 'DB Error ❌' });
      }

      res.json(rows);
    }
  );
});

app.post('/api/register', (req, res) => {
  const now = new Date();

  if (now < START_IDEA_SUB) {
    return res.status(400).json({
      message: 'Idea submissions are not yet started ❌',
    });
  }

  if (now > END_IDEA_SUB && now < START_PROJECT_SUB ) {
    return res.status(400).json({
      message: 'Idea submissions are closed and project submissions are not yet started ❌',
    });
  }

  if (now >= DEADLINE) {
    return res.status(400).json({
      message: 'Project submissions are closed ❌',
    });
  }

  const { teamName, leaderCin, driveLink } = req.body;

  if (!teamName?.trim()) {
    return res.status(400).json({ message: 'Team name is required ❌' });
  }

  if (!leaderCin?.trim() || !/^\d{8}$/.test(leaderCin.trim())) {
    return res
      .status(400)
      .json({ message: 'Leader CIN must be exactly 8 digits ❌' });
  }

  if (!driveLink?.trim()) {
    return res.status(400).json({ message: 'Drive link is required ❌' });
  }

  const sql = `
    INSERT INTO registrations (
      teamName,
      leaderCin,
      driveLink
    ) VALUES (?, ?, ?)
  `;

  db.run(
    sql,
    [teamName.trim(), leaderCin.trim(), driveLink.trim()],
    function (err) {
      if (err) {
        console.error('REGISTER DB ERROR:', err);

        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({
            message: 'Team name already exists ❌',
          });
        }

        return res.status(500).json({
          message: 'DB Error ❌',
          error: err.message,
        });
      }

      console.log('Saved with ID:', this.lastID);
      res.json({ message: 'Saved in DB ✅', id: this.lastID });
    }
  );
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER LISTEN ERROR:', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});