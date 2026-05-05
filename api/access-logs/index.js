import { getDb } from '../_db.js';

export default async function handler(req, res) {
  const db = getDb();

  if (req.method === 'GET') {
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

  } else if (req.method === 'POST') {
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

  } else {
    res.status(405).end();
  }
}
