const pool = require('../db');

const misPredicciones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, pa.equipo_local, pa.equipo_visitante, pa.bandera_local, pa.bandera_visitante,
              pa.grupo, pa.fase, pa.fecha_hora, pa.cierre_prediccion,
              pa.goles_local as resultado_local, pa.goles_visitante as resultado_visitante, pa.finalizado
       FROM predicciones p JOIN partidos pa ON p.partido_id = pa.id
       WHERE p.usuario_id = $1 ORDER BY pa.fecha_hora ASC`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const guardarPrediccion = async (req, res) => {
  const { partido_id, goles_local, goles_visitante } = req.body;
  if (!partido_id || goles_local === undefined || goles_visitante === undefined) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const partido = await pool.query('SELECT cierre_prediccion, finalizado FROM partidos WHERE id = $1', [partido_id]);
    if (!partido.rows.length) return res.status(404).json({ error: 'Partido no encontrado' });
    if (new Date() >= new Date(partido.rows[0].cierre_prediccion) || partido.rows[0].finalizado)
      return res.status(403).json({ error: 'El tiempo para predecir ha cerrado' });
    const result = await pool.query(
      `INSERT INTO predicciones (usuario_id, partido_id, goles_local, goles_visitante)
       VALUES ($1,$2,$3,$4) ON CONFLICT (usuario_id, partido_id)
       DO UPDATE SET goles_local=$3, goles_visitante=$4 RETURNING *`,
      [req.usuario.id, partido_id, goles_local, goles_visitante]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

module.exports = { misPredicciones, guardarPrediccion };
