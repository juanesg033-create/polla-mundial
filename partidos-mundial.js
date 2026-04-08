require('dotenv').config();
const pool = require('./src/db');

const partidos = [
  // FASE DE GRUPOS - Jornada 1
  { equipo_local: 'México', equipo_visitante: 'Ecuador', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-11 18:00:00' },
  { equipo_local: 'Estados Unidos', equipo_visitante: 'Cuba', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-11 21:00:00' },
  { equipo_local: 'Argentina', equipo_visitante: 'Islandia', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-12 15:00:00' },
  { equipo_local: 'Marruecos', equipo_visitante: 'Irak', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-12 18:00:00' },
  { equipo_local: 'España', equipo_visitante: 'Croacia', grupo: 'Grupo C', fase: 'grupos', fecha_hora: '2026-06-12 21:00:00' },
  { equipo_local: 'Brasil', equipo_visitante: 'Alemania', grupo: 'Grupo D', fase: 'grupos', fecha_hora: '2026-06-13 15:00:00' },
  { equipo_local: 'Francia', equipo_visitante: 'Colombia', grupo: 'Grupo E', fase: 'grupos', fecha_hora: '2026-06-13 18:00:00' },
  { equipo_local: 'Portugal', equipo_visitante: 'Argelia', grupo: 'Grupo F', fase: 'grupos', fecha_hora: '2026-06-13 21:00:00' },
  { equipo_local: 'Inglaterra', equipo_visitante: 'Senegal', grupo: 'Grupo G', fase: 'grupos', fecha_hora: '2026-06-14 15:00:00' },
  { equipo_local: 'Países Bajos', equipo_visitante: 'Arabia Saudita', grupo: 'Grupo H', fase: 'grupos', fecha_hora: '2026-06-14 18:00:00' },
  { equipo_local: 'Uruguay', equipo_visitante: 'Sudáfrica', grupo: 'Grupo I', fase: 'grupos', fecha_hora: '2026-06-14 21:00:00' },
  { equipo_local: 'Japón', equipo_visitante: 'Australia', grupo: 'Grupo J', fase: 'grupos', fecha_hora: '2026-06-15 15:00:00' },
  { equipo_local: 'Italia', equipo_visitante: 'Chile', grupo: 'Grupo K', fase: 'grupos', fecha_hora: '2026-06-15 18:00:00' },
  { equipo_local: 'Bélgica', equipo_visitante: 'Perú', grupo: 'Grupo L', fase: 'grupos', fecha_hora: '2026-06-15 21:00:00' },
  { equipo_local: 'Ecuador', equipo_visitante: 'Cuba', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-16 15:00:00' },
  { equipo_local: 'México', equipo_visitante: 'Estados Unidos', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-16 18:00:00' },
  // Jornada 2
  { equipo_local: 'Argentina', equipo_visitante: 'Marruecos', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-16 21:00:00' },
  { equipo_local: 'Islandia', equipo_visitante: 'Irak', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-17 15:00:00' },
  { equipo_local: 'España', equipo_visitante: 'Argelia', grupo: 'Grupo C', fase: 'grupos', fecha_hora: '2026-06-17 18:00:00' },
  { equipo_local: 'Brasil', equipo_visitante: 'Colombia', grupo: 'Grupo D', fase: 'grupos', fecha_hora: '2026-06-17 21:00:00' },
  { equipo_local: 'Francia', equipo_visitante: 'Portugal', grupo: 'Grupo E', fase: 'grupos', fecha_hora: '2026-06-18 15:00:00' },
  { equipo_local: 'Croacia', equipo_visitante: 'Alemania', grupo: 'Grupo F', fase: 'grupos', fecha_hora: '2026-06-18 18:00:00' },
  { equipo_local: 'Inglaterra', equipo_visitante: 'Arabia Saudita', grupo: 'Grupo G', fase: 'grupos', fecha_hora: '2026-06-18 21:00:00' },
  { equipo_local: 'Países Bajos', equipo_visitante: 'Senegal', grupo: 'Grupo H', fase: 'grupos', fecha_hora: '2026-06-19 15:00:00' },
  { equipo_local: 'Uruguay', equipo_visitante: 'Japón', grupo: 'Grupo I', fase: 'grupos', fecha_hora: '2026-06-19 18:00:00' },
  { equipo_local: 'Australia', equipo_visitante: 'Sudáfrica', grupo: 'Grupo J', fase: 'grupos', fecha_hora: '2026-06-19 21:00:00' },
  { equipo_local: 'Italia', equipo_visitante: 'Perú', grupo: 'Grupo K', fase: 'grupos', fecha_hora: '2026-06-20 15:00:00' },
  { equipo_local: 'Bélgica', equipo_visitante: 'Chile', grupo: 'Grupo L', fase: 'grupos', fecha_hora: '2026-06-20 18:00:00' },
  // Jornada 3
  { equipo_local: 'Ecuador', equipo_visitante: 'Estados Unidos', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-22 18:00:00' },
  { equipo_local: 'Cuba', equipo_visitante: 'México', grupo: 'Grupo A', fase: 'grupos', fecha_hora: '2026-06-22 18:00:00' },
  { equipo_local: 'Irak', equipo_visitante: 'Argentina', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-22 21:00:00' },
  { equipo_local: 'Marruecos', equipo_visitante: 'Islandia', grupo: 'Grupo B', fase: 'grupos', fecha_hora: '2026-06-22 21:00:00' },
  { equipo_local: 'Croacia', equipo_visitante: 'Argelia', grupo: 'Grupo C', fase: 'grupos', fecha_hora: '2026-06-23 18:00:00' },
  { equipo_local: 'España', equipo_visitante: 'Alemania', grupo: 'Grupo C', fase: 'grupos', fecha_hora: '2026-06-23 18:00:00' },
  { equipo_local: 'Colombia', equipo_visitante: 'Brasil', grupo: 'Grupo D', fase: 'grupos', fecha_hora: '2026-06-23 21:00:00' },
  { equipo_local: 'Francia', equipo_visitante: 'Croacia', grupo: 'Grupo E', fase: 'grupos', fecha_hora: '2026-06-24 18:00:00' },
  { equipo_local: 'Portugal', equipo_visitante: 'Colombia', grupo: 'Grupo F', fase: 'grupos', fecha_hora: '2026-06-24 21:00:00' },
  { equipo_local: 'Arabia Saudita', equipo_visitante: 'Senegal', grupo: 'Grupo G', fase: 'grupos', fecha_hora: '2026-06-25 18:00:00' },
  { equipo_local: 'Inglaterra', equipo_visitante: 'Países Bajos', grupo: 'Grupo H', fase: 'grupos', fecha_hora: '2026-06-25 21:00:00' },
  { equipo_local: 'Sudáfrica', equipo_visitante: 'Uruguay', grupo: 'Grupo I', fase: 'grupos', fecha_hora: '2026-06-26 18:00:00' },
  { equipo_local: 'Japón', equipo_visitante: 'Australia', grupo: 'Grupo J', fase: 'grupos', fecha_hora: '2026-06-26 21:00:00' },
  { equipo_local: 'Chile', equipo_visitante: 'Italia', grupo: 'Grupo K', fase: 'grupos', fecha_hora: '2026-06-27 18:00:00' },
  { equipo_local: 'Perú', equipo_visitante: 'Bélgica', grupo: 'Grupo L', fase: 'grupos', fecha_hora: '2026-06-27 21:00:00' },
  // OCTAVOS DE FINAL
  { equipo_local: '1A', equipo_visitante: '2B', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-01 18:00:00' },
  { equipo_local: '1C', equipo_visitante: '2D', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-01 21:00:00' },
  { equipo_local: '1E', equipo_visitante: '2F', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-02 18:00:00' },
  { equipo_local: '1G', equipo_visitante: '2H', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-02 21:00:00' },
  { equipo_local: '1B', equipo_visitante: '2A', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-03 18:00:00' },
  { equipo_local: '1D', equipo_visitante: '2C', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-03 21:00:00' },
  { equipo_local: '1F', equipo_visitante: '2E', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-04 18:00:00' },
  { equipo_local: '1H', equipo_visitante: '2G', grupo: 'Octavos', fase: 'octavos', fecha_hora: '2026-07-04 21:00:00' },
  // CUARTOS DE FINAL
  { equipo_local: 'Ganador O1', equipo_visitante: 'Ganador O2', grupo: 'Cuartos', fase: 'cuartos', fecha_hora: '2026-07-09 18:00:00' },
  { equipo_local: 'Ganador O3', equipo_visitante: 'Ganador O4', grupo: 'Cuartos', fase: 'cuartos', fecha_hora: '2026-07-09 21:00:00' },
  { equipo_local: 'Ganador O5', equipo_visitante: 'Ganador O6', grupo: 'Cuartos', fase: 'cuartos', fecha_hora: '2026-07-10 18:00:00' },
  { equipo_local: 'Ganador O7', equipo_visitante: 'Ganador O8', grupo: 'Cuartos', fase: 'cuartos', fecha_hora: '2026-07-10 21:00:00' },
  // SEMIFINALES
  { equipo_local: 'Ganador C1', equipo_visitante: 'Ganador C2', grupo: 'Semifinal', fase: 'semis', fecha_hora: '2026-07-14 21:00:00' },
  { equipo_local: 'Ganador C3', equipo_visitante: 'Ganador C4', grupo: 'Semifinal', fase: 'semis', fecha_hora: '2026-07-15 21:00:00' },
  // TERCER PUESTO
  { equipo_local: 'Perdedor SF1', equipo_visitante: 'Perdedor SF2', grupo: 'Tercer puesto', fase: 'final', fecha_hora: '2026-07-18 18:00:00' },
  // FINAL
  { equipo_local: 'Ganador SF1', equipo_visitante: 'Ganador SF2', grupo: 'Final', fase: 'final', fecha_hora: '2026-07-19 16:00:00' },
];

const cargar = async () => {
  try {
    let insertados = 0;
    for (const p of partidos) {
      const cierre = new Date(new Date(p.fecha_hora).getTime() - 10 * 60 * 1000);
      await pool.query(
        `INSERT INTO partidos (equipo_local, equipo_visitante, grupo, fase, fecha_hora, cierre_prediccion)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT DO NOTHING`,
        [p.equipo_local, p.equipo_visitante, p.grupo, p.fase, p.fecha_hora, cierre]
      );
      insertados++;
    }
    console.log(`✅ ${insertados} partidos cargados exitosamente`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
};

cargar();
