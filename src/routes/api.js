const router = require('express').Router();
const { verificarToken, soloAdmin } = require('../middleware/auth');
const { listarUsuarios, crearUsuario, toggleUsuario, eliminarUsuario } = require('../controllers/usuariosController');
const { listarPartidos, crearPartido, ingresarResultado } = require('../controllers/partidosController');
const { misPredicciones, guardarPrediccion } = require('../controllers/prediccionesController');
const { clasificacion, obtenerPozo, actualizarPozo, misEspeciales, guardarEspeciales } = require('../controllers/clasificacionController');
const seedPartidos = require('../db/seed-partidos');

router.get('/usuarios', verificarToken, soloAdmin, listarUsuarios);
router.post('/usuarios', verificarToken, soloAdmin, crearUsuario);
router.put('/usuarios/:id/toggle', verificarToken, soloAdmin, toggleUsuario);
router.delete('/usuarios/:id', verificarToken, soloAdmin, eliminarUsuario);

router.get('/partidos', listarPartidos);
router.post('/partidos', verificarToken, soloAdmin, crearPartido);
router.post('/admin/seed', verificarToken, soloAdmin, async (req, res) => {
  try {
    const result = await seedPartidos();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/partidos/:id/resultado', verificarToken, soloAdmin, ingresarResultado);

router.get('/predicciones/mis', verificarToken, misPredicciones);
router.post('/predicciones', verificarToken, guardarPrediccion);

router.get('/clasificacion', verificarToken, clasificacion);

router.get('/pozo', verificarToken, obtenerPozo);
router.put('/pozo', verificarToken, soloAdmin, actualizarPozo);

router.get('/especiales/mis', verificarToken, misEspeciales);
router.post('/especiales', verificarToken, guardarEspeciales);

module.exports = router;
