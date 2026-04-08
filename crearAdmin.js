require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/db');

const crearAdmin = async () => {
  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', ['admin']);
    if (existe.rows.length) { console.log('El admin ya existe'); process.exit(0); }
    const hash = await bcrypt.hash('brisas2026admin', 10);
    await pool.query(
      'INSERT INTO usuarios (usuario, nombre_display, password_hash, es_admin, nombre_bloqueado) VALUES ($1,$2,$3,TRUE,TRUE)',
      ['admin', 'Juan Esteban', hash]
    );
    console.log('✅ Admin creado exitosamente');
    console.log('   Usuario:    admin');
    console.log('   Contraseña: brisas2026admin');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
};

crearAdmin();
