const express = require('express');
const router = express.Router();
const notesController =require('../controllers/notes.controller')


// Endpoint GET para obtener todas las notas
router.get('/',notesController.getAllNotes);

//Endpoint GET para obtener los grupos de una nota
router.get('/groups/:idnota', notesController.getGroupNotes);

// Endpoint GET para obtener una nota por su ID
router.get('/:idnota',notesController.getNoteById);

// Endpoint POST para agregar una nueva nota
router.post('/', notesController.createNote);

// Endpoint PUT para actualizar una nota existente
router.put('/:idnota', notesController.editNote);

// Endpoint DELETE para eliminar una nota existente
router.delete('/:idnota', notesController.deleteNote)

// Exportar el enrutador como un middleware
module.exports = router;