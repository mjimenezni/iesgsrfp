const express = require('express');
const router = express.Router();
const dbconnection = require('../dbconnection');

// Endpoint GET para obtener todos los mensajes
router.get('/:idorigen/:iddestino', async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const idorigen = req.params.idorigen;
    const iddestino = req.params.iddestino;
    const [results] = await connection.execute('SELECT * FROM mensajes WHERE idorigen = ? AND iddestino = ? ORDER BY fechahora ASC',[idorigen,iddestino]);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los mensajes');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Endpoint POST para guardar el mensaje 
router.post('/', async(req, res)=> {
     let connection;
     try{
         connection = await dbconnection.getConnection();
         const {idorigen,iddestino,mensaje} =req.body;
         const fechahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [results] =await connection.execute( 'INSERT INTO mensajes (idorigen, iddestino, mensaje, fechahora) VALUES (?, ?, ?, ?)');
        res.json({ idmensaje: results.insertId, idorigen, iddestino, mensaje, fechahora });
     }catch (error) {
            console.error(error);
                res.status(500).send('Error al agregar el mensaje'+ error.message);
         }finally {
            if (connection) {
            connection.release();
    }
  
}
});
// Exportar el enrutador como un middleware
module.exports = router;



