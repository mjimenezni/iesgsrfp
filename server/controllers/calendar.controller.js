const dbconnection = require('../dbconnection');

exports.getAllEvents = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('SELECT * FROM calendario');   
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los eventos del calendario');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
