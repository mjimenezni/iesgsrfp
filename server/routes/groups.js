const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');


// Endpoint GET para obtener todos los grupos
router.get('/', groupsController.getAllGroups);

// Endpoint para obtener un usuario por su id
router.get('/:idgrupo', groupsController.getGroupById);

module.exports = router;