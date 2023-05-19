const express = require('express');
const router = express.Router();
const calendarController =require('../controllers/calendar.controller.js')


// Endpoint GET para obtener todas los eventos del calendario
router.get('/',calendarController.getAllEvents);