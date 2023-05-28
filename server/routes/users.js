const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Endpoint GET para obtener todos los usuarios
router.get('/', usersController.getAllUsers);

// Endpoint para obtener un usuario por su id
router.get('/:idusuario', usersController.getUserById);

// Crear un usuario
router.post('/', usersController.createUser);

// Endpoint PUT para el cambio de contraseña
router.put('/change-password', usersController.changePassword);

// Actualizar un usuario por su id
router.put('/:idusuario', usersController.editUser);

// Eliminar un usuario por su id
router.delete('/:idusuario', usersController.deleteUser);


module.exports = router;
