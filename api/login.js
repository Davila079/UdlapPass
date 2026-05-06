import bcrypt from 'bcryptjs';
import { getDb } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, password } = req.body;
  const db = getDb();

  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    let profileQuery = '';
    if (user.role === 'estudiante') profileQuery = 'SELECT * FROM students WHERE user_id = $1';
    else if (user.role === 'empleado') profileQuery = 'SELECT * FROM employees WHERE user_id = $1';
    else if (user.role === 'administrador') profileQuery = 'SELECT * FROM administrators WHERE user_id = $1';

    const profileResult = await db.query(profileQuery, [user.id]);
    const profile = profileResult.rows[0];

    res.json({
      success: true,
      user: { id: user.id, role: user.role, email: user.email, ...profile },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
