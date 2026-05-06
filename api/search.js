import { getDb } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { query } = req.query;
  const term = `%${query}%`;
  const db = getDb();

  const sql = `
    SELECT u.id, u.role, s.full_name, s.career, s.is_enrolled
    FROM users u JOIN students s ON s.user_id = u.id
    WHERE s.full_name ILIKE $1 OR CAST(u.id AS TEXT) ILIKE $2
    UNION
    SELECT u.id, u.role, e.full_name, e.area AS career, e.is_active AS is_enrolled
    FROM users u JOIN employees e ON e.user_id = u.id
    WHERE e.full_name ILIKE $3 OR CAST(u.id AS TEXT) ILIKE $4
    UNION
    SELECT u.id, u.role, a.full_name, a.area AS career, TRUE AS is_enrolled
    FROM users u JOIN administrators a ON a.user_id = u.id
    WHERE a.full_name ILIKE $5 OR CAST(u.id AS TEXT) ILIKE $6
  `;

  try {
    const result = await db.query(sql, [term, term, term, term, term, term]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
