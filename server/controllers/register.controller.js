const dbconnection = require('../dbconnection');

exports.createUser = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    
    if (!req.body) {
        return res.status(400).send('No se recibieron los datos del usuario');
      }
    const {  email,nombre, password, isAdmin } = req.body || {};
    
    //Se establece avatar por defecto
    const avatar = 'assets/img/avatar/ava1-bg.webp';
    
      
    const [results] = await connection.execute('INSERT INTO usuarios (nombre, email, password, isAdmin,avatar) VALUES (?, ?, ?, ?,?)', [nombre, email, password,isAdmin,avatar]);
   res.json({ idusuario: results.insertId, email, nombre, password, isAdmin,avatar});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};