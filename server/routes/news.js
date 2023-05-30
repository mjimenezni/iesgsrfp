const express = require('express');
const router = express.Router();
const newsController =require('../controllers/news.controller');
const multer = require('multer');
// Middleware de Multer para procesar el formulario multipart
const storage = multer.diskStorage({
  destination: '../iesgsrFP/src/assets/img/news', // Carpeta de destino donde se guardarán las imágenes
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Generar un nombre de archivo único para la imagen
  },
});
const upload = multer({ storage });


// Endpoint GET para obtener todas las noticias
router.get('/',newsController.getAllNews);

// Endpoint GET para obtener una noticia por su ID
router.get('/:idnoticia',newsController.getNewById);

// Endpoint POST para agregar una nueva noticia
router.post('/', upload.single('imagen'),newsController.createNew);

// Endpoint PUT para actualizar una noticia existente
router.put('/:idnoticia', upload.single('imagen'), newsController.editNew);

// Endpoint DELETE para eliminar una noticia existente
router.delete('/:idnoticia', newsController.deleteNew)

// Exportar el enrutador como un middleware
module.exports = router;