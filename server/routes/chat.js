const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Endpoint GET para obtener todos los mensajes entre dos usuarios
router.get('/:idorigen/:iddestino', chatController.getAllMessagesByUsers);

// Endpoint POST para guardar el mensaje 
router.post('/', chatController.createMessage)

// Exportar el enrutador como un middleware
module.exports = router;



