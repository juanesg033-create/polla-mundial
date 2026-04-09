const pool = require('./index');

const crearTablas = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario VARCHAR(50) UNIQUE NOT NULL,
        nombre_display VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nombre_bloqueado BOOLEAN DEFAULT FALSE,
        avatar VARCHAR(50) DEFAULT 'avatar1',
        activo BOOLEAN DEFAULT TRUE,
        es_admin BOOLEAN DEFAULT FALSE,
        creado_en TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar VARCHAR(50) DEFAULT 'avatar1';`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS partidos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        equipo_local VARCHAR(100) NOT NULL,
        bandera_local VARCHAR(10),
        equipo_visitante VARCHAR(100) NOT NULL,
        bandera_visitante VARCHAR(10),
        grupo VARCHAR(20),
        fase VARCHAR(50) DEFAULT 'grupos',
        fecha_hora TIMESTAMP NOT NULL,
        cierre_prediccion TIMESTAMP NOT NULL,
        goles_local INT,
        goles_visitante INT,
        finalizado BOOLEAN DEFAULT FALSE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS predicciones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
        goles_local INT NOT NULL DEFAULT 0,
        goles_visitante INT NOT NULL DEFAULT 0,
        puntos_obtenidos INT DEFAULT 0,
        creado_en TIMESTAMP DEFAULT NOW(),
        UNIQUE(usuario_id, partido_id)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS especiales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE UNIQUE,
        campeon VARCHAR(100),
        goleador VARCHAR(100),
        pts_campeon INT DEFAULT 0,
        pts_goleador INT DEFAULT 0,
        bloqueado BOOLEAN DEFAULT FALSE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS pozo (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        monto_total INT DEFAULT 0,
        premio_1 INT DEFAULT 0,
        premio_2 INT DEFAULT 0,
        premio_3 INT DEFAULT 0,
        actualizado_en TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`
      INSERT INTO pozo (monto_total, premio_1, premio_2, premio_3)
      SELECT 0, 0, 0, 0 WHERE NOT EXISTS (SELECT 1 FROM pozo);
    `);
    await client.query('COMMIT');
    console.log('Tablas creadas exitosamente');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = crearTablas;