const express = require('express');
const router = express.Router();
const calendarController =require('../controllers/calendar.controller.js')


// Endpoint GET para obtener todas los eventos del calendario
router.get('/',calendarController.getAllEvents);

// Endpoint GET para obtener un evento por su ID
router.get('/:idevento',calendarController.getEventById);

// Endpoint GET para obtener los eventos de un grupo determinado
router.get('/groups/:idgrupo', calendarController.getEventsByGroupId);

// Endpoint POST para agregar un evento
router.post('/', calendarController.creteEvent);

// Endpoint PUT para actualizar un evento existente
router.put('/:idevento', calendarController.editEvent);

// Endpoint DELETE para eliminar un evento existente
router.delete('/:idevento', calendarController.deleteEvent)

// Exportar el enrutador como un middleware
module.exports = router