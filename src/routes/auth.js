const router = require('express').Router();
const { login, actualizarNombre, actualizarAvatar } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', login);
router.put('/nombre', verificarToken, actualizarNombre);
router.put('/avatar', verificarToken, actualizarAvatar);

module.exports = router;