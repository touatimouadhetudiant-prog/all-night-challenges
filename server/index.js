import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB CONNECT ERROR:', err);
  } else {
    console.log('Connected to SQLite DB');
  }
});

db.run(`
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
`, (err) => {
  if (err) {
    console.error('TABLE CREATE ERROR:', err);
  } else {
    console.log('registrations table ready');
  }
});

app.get('/api/health', (req, res) => {
  app.delete('/api/delete-all-registrations', (req, res) => {
  db.run('DELETE FROM registrations', function (err) {
    if (err) {
      console.error('DELETE ALL ERROR:', err);
      return res.status(500).json({ message: 'Delete failed ❌' });
    }

    console.log('All registrations deleted ✅');
    res.json({ message: 'All registrations deleted ✅' });
  });
});
  res.json({ status: 'ok' });
});

app.get('/api/registrations', (req, res) => {
  db.all('SELECT * FROM registrations ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('GET REGISTRATIONS ERROR:', err);
      return res.status(500).json({ message: 'DB Error ❌' });
    }

    res.json(rows);
  });
});

app.post('/api/register', (req, res) => {
  const data = req.body;

  console.log('REGISTER HIT:', data);

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
      data.teamName,
      data.leaderFullName,
      data.leaderEmail,
      data.leaderPhone,
      data.leaderCin,
      data.member1FullName,
      data.member1Email,
      data.member2FullName,
      data.member2Email
    ],
    function (err) {
      if (err) {
        console.error('REGISTER DB ERROR:', err);
        return res.status(500).json({
          message: 'DB Error ❌',
          error: err.message
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