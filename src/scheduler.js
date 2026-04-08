const cron = require('node-cron');
const pool = require('./db');

const iniciarScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const ahora = new Date();
      const en30min = new Date(ahora.getTime() + 30 * 60 * 1000);
      const proximos = await pool.query(
        'SELECT id, equipo_local, equipo_visitante, cierre_prediccion FROM partidos WHERE cierre_prediccion BETWEEN $1 AND $2 AND finalizado = FALSE',
        [ahora, en30min]
      );
      if (proximos.rows.length > 0) {
        proximos.rows.forEach(p => console.log(`⚠️  Cierra pronto: ${p.equipo_local} vs ${p.equipo_visitante}`));
      }
    } catch (err) {
      console.error('Error en scheduler:', err);
    }
  });
  console.log('Scheduler iniciado');
};

module.exports = iniciarScheduler;
