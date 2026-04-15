const pool = require('.');   // ← en vez de require('./db')

const PARTIDOS = [
  { local:'México', visita:'Sudáfrica', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-11T14:00:00' },
  { local:'Corea del Sur', visita:'Rep. Checa', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-11T21:00:00' },
  { local:'Rep. Checa', visita:'Sudáfrica', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-18T11:00:00' },
  { local:'México', visita:'Corea del Sur', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-18T20:00:00' },
  { local:'Rep. Checa', visita:'México', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-24T20:00:00' },
  { local:'Sudáfrica', visita:'Corea del Sur', grupo:'Grupo A', fase:'grupos', fecha:'2026-06-24T20:00:01' },
  { local:'Canadá', visita:'Bosnia y Herzegovina', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-12T14:00:00' },
  { local:'Qatar', visita:'Suiza', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-13T14:00:00' },
  { local:'Suiza', visita:'Bosnia y Herzegovina', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-18T14:00:00' },
  { local:'Canadá', visita:'Qatar', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-18T17:00:00' },
  { local:'Suiza', visita:'Canadá', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-24T14:00:00' },
  { local:'Bosnia y Herzegovina', visita:'Qatar', grupo:'Grupo B', fase:'grupos', fecha:'2026-06-24T14:00:01' },
  { local:'Brasil', visita:'Marruecos', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-13T17:00:00' },
  { local:'Haití', visita:'Escocia', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-13T20:00:00' },
  { local:'Escocia', visita:'Marruecos', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-19T17:00:00' },
  { local:'Brasil', visita:'Haití', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-19T20:00:00' },
  { local:'Brasil', visita:'Escocia', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-24T17:00:00' },
  { local:'Marruecos', visita:'Haití', grupo:'Grupo C', fase:'grupos', fecha:'2026-06-24T17:00:01' },
  { local:'Estados Unidos', visita:'Paraguay', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-12T20:00:00' },
  { local:'Australia', visita:'Turquía', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-12T23:00:00' },
  { local:'Turquía', visita:'Paraguay', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-18T23:00:00' },
  { local:'Estados Unidos', visita:'Australia', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-19T14:00:00' },
  { local:'Turquía', visita:'Estados Unidos', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-25T21:00:00' },
  { local:'Paraguay', visita:'Australia', grupo:'Grupo D', fase:'grupos', fecha:'2026-06-25T21:00:01' },
  { local:'Alemania', visita:'Curazao', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-14T12:00:00' },
  { local:'Costa de Marfil', visita:'Ecuador', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-14T18:00:00' },
  { local:'Alemania', visita:'Costa de Marfil', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-20T15:00:00' },
  { local:'Ecuador', visita:'Curazao', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-20T19:00:00' },
  { local:'Ecuador', visita:'Alemania', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-25T15:00:00' },
  { local:'Curazao', visita:'Costa de Marfil', grupo:'Grupo E', fase:'grupos', fecha:'2026-06-25T15:00:01' },
  { local:'Países Bajos', visita:'Japón', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-14T15:00:00' },
  { local:'Suecia', visita:'Túnez', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-14T21:00:00' },
  { local:'Túnez', visita:'Japón', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-19T23:00:00' },
  { local:'Países Bajos', visita:'Suecia', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-20T12:00:00' },
  { local:'Japón', visita:'Suecia', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-25T18:00:00' },
  { local:'Túnez', visita:'Países Bajos', grupo:'Grupo F', fase:'grupos', fecha:'2026-06-25T18:00:01' },
  { local:'Bélgica', visita:'Egipto', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-15T14:00:00' },
  { local:'Irán', visita:'Nueva Zelanda', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-15T20:00:00' },
  { local:'Bélgica', visita:'Irán', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-21T14:00:00' },
  { local:'Nueva Zelanda', visita:'Egipto', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-21T20:00:00' },
  { local:'Egipto', visita:'Irán', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-26T22:00:00' },
  { local:'Nueva Zelanda', visita:'Bélgica', grupo:'Grupo G', fase:'grupos', fecha:'2026-06-26T22:00:01' },
  { local:'España', visita:'Cabo Verde', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-15T11:00:00' },
  { local:'Arabia Saudita', visita:'Uruguay', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-15T17:00:00' },
  { local:'España', visita:'Arabia Saudita', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-21T11:00:00' },
  { local:'Uruguay', visita:'Cabo Verde', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-21T17:00:00' },
  { local:'Uruguay', visita:'España', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-26T19:00:00' },
  { local:'Cabo Verde', visita:'Arabia Saudita', grupo:'Grupo H', fase:'grupos', fecha:'2026-06-26T19:00:01' },
  { local:'Francia', visita:'Senegal', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-16T14:00:00' },
  { local:'Irak', visita:'Noruega', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-16T17:00:00' },
  { local:'Francia', visita:'Irak', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-22T16:00:00' },
  { local:'Noruega', visita:'Senegal', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-22T19:00:00' },
  { local:'Noruega', visita:'Francia', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-26T14:00:00' },
  { local:'Senegal', visita:'Irak', grupo:'Grupo I', fase:'grupos', fecha:'2026-06-26T14:00:01' },
  { local:'Austria', visita:'Jordania', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-15T23:00:00' },
  { local:'Argentina', visita:'Argelia', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-16T20:00:00' },
  { local:'Argentina', visita:'Austria', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-22T12:00:00' },
  { local:'Jordania', visita:'Argelia', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-22T22:00:00' },
  { local:'Jordania', visita:'Argentina', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-27T21:00:00' },
  { local:'Argelia', visita:'Austria', grupo:'Grupo J', fase:'grupos', fecha:'2026-06-27T21:00:01' },
  { local:'Portugal', visita:'RD Congo', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-17T12:00:00' },
  { local:'Uzbekistán', visita:'Colombia', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-17T21:00:00' },
  { local:'Portugal', visita:'Uzbekistán', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-23T12:00:00' },
  { local:'Colombia', visita:'RD Congo', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-23T21:00:00' },
  { local:'Colombia', visita:'Portugal', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-27T18:30:00' },
  { local:'RD Congo', visita:'Uzbekistán', grupo:'Grupo K', fase:'grupos', fecha:'2026-06-27T18:30:01' },
  { local:'Inglaterra', visita:'Croacia', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-17T15:00:00' },
  { local:'Ghana', visita:'Panamá', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-17T18:00:00' },
  { local:'Inglaterra', visita:'Ghana', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-23T15:00:00' },
  { local:'Panamá', visita:'Croacia', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-23T18:00:00' },
  { local:'Panamá', visita:'Inglaterra', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-27T16:00:00' },
  { local:'Croacia', visita:'Ghana', grupo:'Grupo L', fase:'grupos', fecha:'2026-06-27T16:00:01' },
  ...Array.from({length:16},()=>({ local:'Por definir', visita:'Por definir', grupo:'16avos', fase:'16avos', fecha:'2026-06-29T00:00:00' })),
  ...Array.from({length:8}, ()=>({ local:'Por definir', visita:'Por definir', grupo:'Octavos', fase:'octavos', fecha:'2026-07-04T00:00:00' })),
  ...Array.from({length:4}, ()=>({ local:'Por definir', visita:'Por definir', grupo:'Cuartos', fase:'cuartos', fecha:'2026-07-09T00:00:00' })),
  ...Array.from({length:2}, ()=>({ local:'Por definir', visita:'Por definir', grupo:'Semifinal', fase:'semis', fecha:'2026-07-14T00:00:00' })),
  { local:'Por definir', visita:'Por definir', grupo:'Final', fase:'final', fecha:'2026-07-19T00:00:00' },
];

const seedPartidos = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM predicciones');
    await client.query('DELETE FROM partidos');
    let insertados = 0;
    for (const p of PARTIDOS) {
      const cierre = new Date(new Date(p.fecha).getTime() - 10 * 60 * 1000);
      await client.query(
        `INSERT INTO partidos (equipo_local, equipo_visitante, grupo, fase, fecha_hora, cierre_prediccion)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [p.local, p.visita, p.grupo, p.fase, p.fecha, cierre.toISOString()]
      );
      insertados++;
    }
    await client.query('COMMIT');
    return { ok: true, insertados };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = seedPartidos;
