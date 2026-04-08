const pool = require('../db');

const listarPartidos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM partidos ORDER BY fecha_hora ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const crearPartido = async (req, res) => {
  const { equipo_local, bandera_local, equipo_visitante, bandera_visitante, grupo, fase, fecha_hora } = req.body;
  if (!equipo_local || !equipo_visitante || !fecha_hora) return res.status(400).json({ error: 'Faltan datos del partido' });
  const cierre = new Date(new Date(fecha_hora).getTime() - 10 * 60 * 1000);
  try {
    const result = await pool.query(
      'INSERT INTO partidos (equipo_local, bandera_local, equipo_visitante, bandera_visitante, grupo, fase, fecha_hora, cierre_prediccion) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [equipo_local, bandera_local, equipo_visitante, bandera_visitante, grupo, fase || 'grupos', fecha_hora, cierre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const ingresarResultado = async (req, res) => {
  const { goles_local, goles_visitante } = req.body;
  if (goles_local === undefined || goles_visitante === undefined) return res.status(400).json({ error: 'Faltan los goles' });
  try {
    await pool.query('UPDATE partidos SET goles_local=$1, goles_visitante=$2, finalizado=TRUE WHERE id=$3', [goles_local, goles_visitante, req.params.id]);
    const predicciones = await pool.query('SELECT * FROM predicciones WHERE partido_id = $1', [req.params.id]);
    for (const pred of predicciones.rows) {
      let puntos = 0;
      const exacto = pred.goles_local === goles_local && pred.goles_visitante === goles_visitante;
      const ganador = (
        (pred.goles_local > pred.goles_visitante && goles_local > goles_visitante) ||
        (pred.goles_local < pred.goles_visitante && goles_local < goles_visitante) ||
        (pred.goles_local === pred.goles_visitante && goles_local === goles_visitante)
      );
      if (exacto) puntos = 10;
      else if (ganador) puntos = 6;
      await pool.query('UPDATE predicciones SET puntos_obtenidos=$1 WHERE id=$2', [puntos, pred.id]);
    }
    res.json({ mensaje: 'Resultado ingresado y puntos calculados' });
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

module.exports = { listarPartidos, crearPartido, ingresarResultado };
