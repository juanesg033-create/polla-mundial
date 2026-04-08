const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const login = async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND activo = TRUE', [usuario]);
    if (!result.rows.length) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const user = result.rows[0];
    if (!await bcrypt.compare(password, user.password_hash)) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, nombre_display: user.nombre_display, es_admin: user.es_admin, nombre_bloqueado: user.nombre_bloqueado },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, usuario: { id: user.id, usuario: user.usuario, nombre_display: user.nombre_display, es_admin: user.es_admin, nombre_bloqueado: user.nombre_bloqueado } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const actualizarNombre = async (req, res) => {
  const { nombre_display } = req.body;
  if (!nombre_display || nombre_display.trim().length < 2) return res.status(400).json({ error: 'Nombre muy corto' });
  try {
    const user = await pool.query('SELECT nombre_bloqueado FROM usuarios WHERE id = $1', [req.usuario.id]);
    if (user.rows[0].nombre_bloqueado) return res.status(403).json({ error: 'El nombre ya no puede cambiarse' });
    await pool.query('UPDATE usuarios SET nombre_display = $1, nombre_bloqueado = TRUE WHERE id = $2', [nombre_display.trim(), req.usuario.id]);
    res.json({ mensaje: 'Nombre actualizado y bloqueado' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login, actualizarNombre };
