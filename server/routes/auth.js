// Importamos el módulo de express y el módulo de conexión a la base de datos
const express = require('express');
// Creamos el router para las rutas de autenticación
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Endpoint POST para el login de usuarios
router.post('/', authController.loginUser);


// Exportamos el router de autenticación
module.exports = router;
