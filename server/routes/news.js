const express = require('express');
const router = express.Router();
const newsController =require('../controllers/news.controller');


// Endpoint GET para obtener todas las noticias
router.get('/',newsController.getAllNews);

// Endpoint GET para obtener una noticia por su ID
router.get('/:idnoticia',newsController.getNewById);

// Endpoint POST para agregar una nueva noticia
router.post('/', newsController.createNew);

// Endpoint PUT para actualizar una noticia existente
router.put('/:idnoticia', newsController.editNew);

// Endpoint DELETE para eliminar una noticia existente
router.delete('/:idnoticia', newsController.deleteNew)

// Exportar el enrutador como un middleware
module.exports = router;