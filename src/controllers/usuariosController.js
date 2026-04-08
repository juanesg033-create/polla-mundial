const bcrypt = require('bcryptjs');
const pool = require('../db');

const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, usuario, nombre_display, activo, nombre_bloqueado, es_admin, creado_en FROM usuarios ORDER BY creado_en DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const crearUsuario = async (req, res) => {
  const { usuario, nombre_display, password } = req.body;
  if (!usuario || !nombre_display || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    if (existe.rows.length) return res.status(400).json({ error: 'El usuario ya existe' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (usuario, nombre_display, password_hash) VALUES ($1, $2, $3) RETURNING id, usuario, nombre_display, activo',
      [usuario.toLowerCase().trim(), nombre_display.trim(), hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const toggleUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE usuarios SET activo = NOT activo WHERE id = $1 AND es_admin = FALSE RETURNING id, usuario, nombre_display, activo',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

const eliminarUsuario = async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1 AND es_admin = FALSE', [req.params.id]);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) { res.status(500).json({ error: 'Error en el servidor' }); }
};

module.exports = { listarUsuarios, crearUsuario, toggleUsuario, eliminarUsuario };
