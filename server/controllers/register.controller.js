const dbconnection = require('../dbconnection');

exports.createUser = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    
    if (!req.body) {
        return res.status(400).send('No se recibieron los datos del usuario');
      }
    const {  email,nombre, password, isAdmin } = req.body || {};
      
    const [results] = await connection.execute('INSERT INTO usuarios (nombre, email, password, isAdmin) VALUES (?, ?, ?, ?)', [nombre, email, password,isAdmin]);
   res.json({ idusuario: results.insertId, email, nombre, password, isAdmin});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};