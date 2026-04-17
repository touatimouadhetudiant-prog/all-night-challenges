import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// =====================
// INIT
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// =====================
// TIME CONFIG (FIXED)
// =====================
const DEADLINE = new Date('2026-04-19T07:00:00Z');
const START_IDEA_SUB = new Date('2026-04-16T17:00:00Z');
const END_IDEA_SUB = new Date('2026-04-18T20:00:00Z');
const START_PROJECT_SUB = new Date('2026-04-18T22:00:00Z');

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// DB
// =====================
const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB CONNECT ERROR:', err);
  } else {
    console.log('SQLite connected ✅');
  }
});

// =====================
// TABLE
// =====================
db.run(`
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teamName TEXT,
  teamNameNormalized TEXT UNIQUE,
  leaderCin TEXT,
  ideaDriveLink TEXT,
  projectDriveLink TEXT,
  idea_last_updated_at DATETIME DEFAULT NULL,
  project_updated_at DATETIME DEFAULT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
// =====================
// HEALTH
// =====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// =====================
// GET ALL REGISTRATIONS
// =====================
app.get('/api/registrations', (req, res) => {
  db.all(
    `SELECT id, teamName, leaderCin, ideaDriveLink, projectDriveLink,idea_last_updated_at,project_updated_at, createdAt
     FROM registrations
     ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'DB error' });
      }
      res.json(rows);
    }
  );
});

// =====================
// REGISTER ROUTE (FIXED)
// =====================
app.post('/api/register', (req, res) => {
  const now = new Date();

  const { teamName, leaderCin, driveLink } = req.body;

  if (!teamName?.trim()) {
    return res.status(400).json({ message: 'Team name required ❌' });
  }

  if (!leaderCin?.trim() || !/^\d{8}$/.test(leaderCin.trim())) {
    return res.status(400).json({ message: 'Leader CIN invalid ❌' });
  }

  if (!driveLink?.trim()) {
    return res.status(400).json({ message: 'Drive link required ❌' });
  }

  const normalized = teamName.trim().toLowerCase();

  // =========================
  // FIND TEAM
  // =========================
  db.get(
    `SELECT * FROM registrations WHERE teamNameNormalized = ?`,
    [normalized],
    (err, team) => {
      if (err) {
        return res.status(500).json({ message: 'DB error' });
      }

      // =========================
      // CREATE IF NOT EXISTS
      // =========================
      if (!team) {
        db.run(
          `INSERT INTO registrations (teamName, teamNameNormalized, leaderCin)
           VALUES (?, ?, ?)`,
          [teamName.trim(), normalized, leaderCin.trim()],
          function (err) {
            if (err) {
              return res.status(500).json({ message: 'DB error' });
            }

            return updatePhase(this.lastID);
          }
        );
      } else {
        updatePhase(team.id);
      }

      // =========================
      // UPDATE PHASE LOGIC
      // =========================
      function updatePhase(teamId) {

        // IDEA PHASE
//        const IDEA_START = new Date('2026-04-18T17:00:00Z');
//        const IDEA_END   = new Date('2026-04-18T20:00:00Z');

        // PROJECT PHASE
//        const PROJECT_START = new Date('2026-04-18T22:00:00Z');
//        const DEADLINE = new Date('2026-04-19T07:00:00Z');

        // -------------------------
        // IDEA SUBMISSION
        // -------------------------
        if (now >= START_IDEA_SUB && now <= END_IDEA_SUB) {
          db.run(
            `UPDATE registrations SET ideaDriveLink = ? , idea_last_updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [driveLink.trim(), teamId],
            () => {
              return res.json({
                message: 'Idea submitted ✅'
              });
            }
          );
          return;
        }

        // -------------------------
        // PROJECT SUBMISSION
        // -------------------------
        if (now >= START_PROJECT_SUB && now < DEADLINE) {
          db.run(
            `UPDATE registrations SET projectDriveLink = ?, project_updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [driveLink.trim(), teamId],
            () => {
              return res.json({
                message: 'Project submitted ✅'
              });
            }
          );
          return;
        }

        return res.status(400).json({
          message: 'Submission not allowed in this phase ❌'
        });
      }
    }
  );
});





// =====================
// START SERVER
// =====================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// =====================
// ERROR HANDLING
// =====================
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});
