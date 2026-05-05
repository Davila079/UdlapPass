import { getDb } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { user_id } = req.query;
  const db = getDb();

  try {
    const result = await db.query(
      `SELECT type FROM access_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user_id]
    );
    res.json({ last: result.rows.length > 0 ? result.rows[0].type : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
