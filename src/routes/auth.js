const router = require('express').Router();
const { login, actualizarNombre } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', login);
router.put('/nombre', verificarToken, actualizarNombre);

module.exports = router;
