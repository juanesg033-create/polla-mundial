const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const soloAdmin = (req, res, next) => {
  if (!req.usuario.es_admin) return res.status(403).json({ error: 'Solo administradores' });
  next();
};

module.exports = { verificarToken, soloAdmin };
