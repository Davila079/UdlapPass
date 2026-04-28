require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a MariaDB');
});

// ── LOGIN ──────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  // Primero buscamos el usuario y su rol
  db.query('SELECT * FROM users WHERE id = ?', [id], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ error: 'Credenciales incorrectas' });

    // Según el rol buscamos el perfil correspondiente
    let profileQuery = '';
    if (user.role === 'estudiante') {
      profileQuery = 'SELECT * FROM students WHERE user_id = ?';
    } else if (user.role === 'empleado') {
      profileQuery = 'SELECT * FROM employees WHERE user_id = ?';
    } else if (user.role === 'administrador') {
      profileQuery = 'SELECT * FROM administrators WHERE user_id = ?';
    }

    db.query(profileQuery, [user.id], (err, profileResults) => {
      if (err) return res.status(500).json({ error: 'Error obteniendo perfil' });

      const profile = profileResults[0];

      res.json({
        success: true,
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          ...profile
        }
      });
    });
  });
});

// ── BUSCAR USUARIOS ────────────────────────────────
app.get('/search', (req, res) => {
  const { query } = req.query;
  const term = `%${query}%`;

  const sql = `
    SELECT u.id, u.role, s.full_name, s.career, s.is_enrolled
    FROM users u
    JOIN students s ON s.user_id = u.id
    WHERE s.full_name LIKE ? OR u.id LIKE ?

    UNION

    SELECT u.id, u.role, e.full_name, e.area AS career, e.is_active AS is_enrolled
    FROM users u
    JOIN employees e ON e.user_id = u.id
    WHERE e.full_name LIKE ? OR u.id LIKE ?

    UNION

    SELECT u.id, u.role, a.full_name, a.area AS career, TRUE AS is_enrolled
    FROM users u
    JOIN administrators a ON a.user_id = u.id
    WHERE a.full_name LIKE ? OR u.id LIKE ?
  `;

  db.query(sql, [term, term, term, term, term, term], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(results);
  });
});
// ── REGISTROS DE ACCESO ────────────────────────────
app.get('/access-logs', (req, res) => {
  const sql = `
    SELECT 
      a.id, a.type, a.method, a.location, a.created_at,
      u.id AS userId, u.role,
      COALESCE(s.full_name, e.full_name, ad.full_name) AS name
    FROM access_logs a
    JOIN users u ON u.id = a.user_id
    LEFT JOIN students s ON s.user_id = u.id
    LEFT JOIN employees e ON e.user_id = u.id
    LEFT JOIN administrators ad ON ad.user_id = u.id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(results);
  });
});

// ── INSERTAR REGISTRO ──────────────────────────────
app.post('/access-logs', (req, res) => {
  const { user_id, type, method, location } = req.body;

  db.query(
    'INSERT INTO access_logs (user_id, type, method, location) VALUES (?, ?, ?, ?)',
    [user_id, type, method, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error guardando registro' });
      res.json({ success: true, id: result.insertId });
    }
  );
});
// ── INICIAR SERVIDOR ────────────────────────────────
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
