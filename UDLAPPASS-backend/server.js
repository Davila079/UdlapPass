require('dotenv').config({ path: __dirname + '/.env' });

console.log('Variables cargadas:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***existe***' : 'UNDEFINED',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a PostgreSQL');
});

// ── LOGIN ──────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    let profileQuery = '';
    if (user.role === 'estudiante') {
      profileQuery = 'SELECT * FROM students WHERE user_id = $1';
    } else if (user.role === 'empleado') {
      profileQuery = 'SELECT * FROM employees WHERE user_id = $1';
    } else if (user.role === 'administrador') {
      profileQuery = 'SELECT * FROM administrators WHERE user_id = $1';
    }

    const profileResult = await db.query(profileQuery, [user.id]);
    const profile = profileResult.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        ...profile
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ── BUSCAR USUARIOS ────────────────────────────────
app.get('/search', async (req, res) => {
  const { query } = req.query;
  const term = `%${query}%`;

  const sql = `
    SELECT u.id, u.role, s.full_name, s.career, s.is_enrolled
    FROM users u
    JOIN students s ON s.user_id = u.id
    WHERE s.full_name ILIKE $1 OR CAST(u.id AS TEXT) ILIKE $2

    UNION

    SELECT u.id, u.role, e.full_name, e.area AS career, e.is_active AS is_enrolled
    FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.full_name ILIKE $3 OR CAST(u.id AS TEXT) ILIKE $4

    UNION

    SELECT u.id, u.role, a.full_name, a.area AS career, TRUE AS is_enrolled
    FROM users u
    JOIN administrators a ON a.user_id = u.id
    WHERE a.full_name ILIKE $5 OR CAST(u.id AS TEXT) ILIKE $6
  `;

  try {
    const result = await db.query(sql, [term, term, term, term, term, term]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ── ÚLTIMO REGISTRO DE ACCESO ──────────────────────
app.get('/access-logs/last', async (req, res) => {
  const { user_id } = req.query;

  try {
    const result = await db.query(
      `SELECT type FROM access_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [user_id]
    );
    res.json({ last: result.rows.length > 0 ? result.rows[0].type : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ── REGISTROS DE ACCESO ────────────────────────────
app.get('/access-logs', async (req, res) => {
  const sql = `
    SELECT 
      a.id, a.type, a.method, a.location, a.created_at,
      u.id AS "userId", u.role,
      COALESCE(s.full_name, e.full_name, ad.full_name) AS name
    FROM access_logs a
    JOIN users u ON u.id = a.user_id
    LEFT JOIN students s ON s.user_id = u.id
    LEFT JOIN employees e ON e.user_id = u.id
    LEFT JOIN administrators ad ON ad.user_id = u.id
    ORDER BY a.created_at DESC
  `;

  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ── INSERTAR REGISTRO ──────────────────────────────
app.post('/access-logs', async (req, res) => {
  const { user_id, type, method, location } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO access_logs (user_id, type, method, location) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, type, method, location]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error guardando registro' });
  }
});

// ── INICIAR SERVIDOR ────────────────────────────────
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});