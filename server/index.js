import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-this-in-railway';

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
    leaderFullName TEXT,
    leaderEmail TEXT,
    leaderPhone TEXT,
    leaderCin TEXT,
    member1FullName TEXT,
    member1Email TEXT,
    member2FullName TEXT,
    member2Email TEXT,
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

db.serialize(() => {
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

  db.run(
    `
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_leaderEmail
    ON registrations(LOWER(TRIM(leaderEmail)))
  `,
    (err) => {
      if (err) {
        console.error('UNIQUE leaderEmail ERROR:', err);
      } else {
        console.log('Unique leaderEmail ready ✅');
      }
    }
  );
});

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized ❌' });
  }

  next();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/registrations', adminAuth, (req, res) => {
  db.all('SELECT * FROM registrations ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('GET REGISTRATIONS ERROR:', err);
      return res.status(500).json({ message: 'DB Error ❌' });
    }

    res.json(rows);
  });
});

app.get('/api/delete-all-registrations', adminAuth, (req, res) => {
  db.run('DELETE FROM registrations', function (err) {
    if (err) {
      console.error('DELETE ALL ERROR:', err);
      return res.status(500).json({ message: 'Delete failed ❌' });
    }

    console.log('All registrations deleted ✅');
    res.json({ message: 'All registrations deleted ✅' });
  });
});

app.post('/api/register', (req, res) => {
  const data = req.body;

  console.log('REGISTER HIT:', data);

  const {
    teamName,
    leaderFullName,
    leaderEmail,
    leaderPhone,
    leaderCin,
    member1FullName,
    member1Email,
    member2FullName,
    member2Email,
  } = data;

  if (!teamName?.trim()) {
    return res.status(400).json({ message: 'Team name is required ❌' });
  }

  if (!leaderFullName?.trim()) {
    return res.status(400).json({ message: 'Leader full name is required ❌' });
  }

  if (!leaderEmail?.trim()) {
    return res.status(400).json({ message: 'Leader email is required ❌' });
  }

  if (!isValidEmail(leaderEmail)) {
    return res.status(400).json({ message: 'Leader email is invalid ❌' });
  }

  if (!leaderPhone || !/^\d{8}$/.test(String(leaderPhone))) {
    return res.status(400).json({ message: 'Phone must be exactly 8 digits ❌' });
  }

  if (leaderCin && !/^\d{8}$/.test(String(leaderCin))) {
    return res.status(400).json({ message: 'CIN must be exactly 8 digits ❌' });
  }

  if (member1Email && !isValidEmail(member1Email)) {
    return res.status(400).json({ message: 'Member 1 email is invalid ❌' });
  }

  if (member2Email && !isValidEmail(member2Email)) {
    return res.status(400).json({ message: 'Member 2 email is invalid ❌' });
  }

  const emails = [leaderEmail, member1Email, member2Email]
    .filter(Boolean)
    .map(normalizeEmail);

  if (new Set(emails).size !== emails.length) {
    return res.status(400).json({ message: 'Emails must be different ❌' });
  }

  const sql = `
    INSERT INTO registrations (
      teamName,
      leaderFullName,
      leaderEmail,
      leaderPhone,
      leaderCin,
      member1FullName,
      member1Email,
      member2FullName,
      member2Email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      teamName.trim(),
      leaderFullName.trim(),
      leaderEmail.trim(),
      String(leaderPhone).trim(),
      leaderCin ? String(leaderCin).trim() : '',
      member1FullName?.trim() || '',
      member1Email?.trim() || '',
      member2FullName?.trim() || '',
      member2Email?.trim() || '',
    ],
    function (err) {
      if (err) {
        console.error('REGISTER DB ERROR:', err);

        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({
            message: 'Team name or Leader email already exists ❌',
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