const pool = require('../db');

const clasificacion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.nombre_display,
        COALESCE(SUM(p.puntos_obtenidos),0) + COALESCE(e.pts_campeon,0) + COALESCE(e.pts_goleador,0) AS puntos_total,
        COUNT(CASE WHEN p.puntos_obtenidos = 10 THEN 1 END) AS exactos,
        COUNT(CASE WHEN p.puntos_obtenidos = 6 THEN 1 END) AS ganador
      FROM usuarios u
      LEFT JOIN predicciones p ON u.id = p.usuario_id
      LEFT JOIN especiales e ON u.id = e.usuario_id
      WHERE u.activo = TRUE AND u.es_admin = FALSE
      GROUP BY u.id, u.nombre_display, e.pts_campeon, e.pts_goleador
      ORDER BY puntos_total DESC
    `);
    res.json(result.rows.map((r, i) => ({ ...r, posicion: i + 1 })));
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const obtenerPozo = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pozo LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const actualizarPozo = async (req, res) => {
  const { monto_total } = req.body;
  if (!monto_total || monto_total < 0) return res.status(400).json({ error: 'Monto inválido' });
  try {
    const result = await pool.query(
      'UPDATE pozo SET monto_total=$1, premio_1=$2, premio_2=$3, premio_3=$4, actualizado_en=NOW() RETURNING *',
      [monto_total, Math.round(monto_total * 0.70), Math.round(monto_total * 0.20), Math.round(monto_total * 0.10)]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const misEspeciales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM especiales WHERE usuario_id = $1', [req.usuario.id]);
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const guardarEspeciales = async (req, res) => {
  const { campeon, goleador } = req.body;
  try {
    const existe = await pool.query('SELECT bloqueado FROM especiales WHERE usuario_id = $1', [req.usuario.id]);
    if (existe.rows.length && existe.rows[0].bloqueado) return res.status(403).json({ error: 'Predicciones especiales bloqueadas' });
    await pool.query(
      'INSERT INTO especiales (usuario_id, campeon, goleador) VALUES ($1,$2,$3) ON CONFLICT (usuario_id) DO UPDATE SET campeon=$2, goleador=$3',
      [req.usuario.id, campeon, goleador]
    );
    res.json({ mensaje: 'Guardado' });
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

module.exports = { clasificacion, obtenerPozo, actualizarPozo, misEspeciales, guardarEspeciales };
