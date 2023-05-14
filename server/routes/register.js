const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller');

// Endpoint POST para agregar un nuevo usuario
router.post('/', registerController.createUser);

module.exports = router;