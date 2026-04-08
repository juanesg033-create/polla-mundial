require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/db');

const crearAdmin = async () => {
  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', ['admin']);
    if (existe.rows.length) {
      console.log('El admin ya existe');
      return;
    }
    const hash = await bcrypt.hash('brisas2026admin', 10);
    await pool.query(
      'INSERT INTO usuarios (usuario, nombre_display, password, es_admin) VALUES ($1, $2, $3, $4)',
      ['admin', 'Juan Esteban', hash, true]
    );
    console.log('✅ Admin creado exitosamente');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

module.exports = crearAdmin;