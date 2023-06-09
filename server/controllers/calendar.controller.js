const dbconnection = require('../dbconnection');

exports.getAllEvents = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('SELECT * FROM eventos_calendario');   
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

exports.getEventById = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM eventos_calendario WHERE idevento = ?',
      [req.params.idevento]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Evento no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el evento');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.creteEvent = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();

    if (!req.body) {
        return res.status(400).send('No se recibieron los datos del evento');
      }
    const { evento, idgrupo, fecha} = req.body || {};
    
    const [results] = await connection.execute(
      'INSERT INTO eventos_calendario (evento, fecha, idgrupo) VALUES (?, ?, ?)',
      [evento, fecha, idgrupo]
    );
    res.json({ idevento: results.insertId, evento, fecha,idgrupo });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el evento'+ error.message);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.editEvent = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const { evento, idgrupo, fecha } = req.body;
    await connection.execute(
      'UPDATE eventos_calendario SET evento = ?, idgrupo = ?, fecha = ? WHERE idevento = ?',
      [evento, idgrupo, fecha, req.params.idevento]
    );
 
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el evento');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteEvent = async (req, res) => {
  const id = req.params.idevento;
  console.log(id);
  let connection;
  try {
    connection = await dbconnection.getConnection();

    // Eliminamos el evento
    const [result] = await connection.execute('DELETE FROM eventos_calendario WHERE idevento = ?', [id]);

    // Comprobamos si se ha eliminado algún evento
    if (result.affectedRows === 0) {
      res.status(404).send('Evento no encontrado');
    } else {
      res.status(204).send(); // Enviamos una respuesta vacía si se ha eliminado correctamente
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el evento');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getEventsByGroupId = async (req, res) => {
  let connection;
  try {
    const groupId = req.params.idgrupo; // Obtener el ID del grupo desde los parámetros de la solicitud

    connection = await dbconnection.getConnection();
    //Selecciona todos los eventos de un grupo determinado y los eventos del grupo general
    const [results] = await connection.execute(
      `SELECT ec.* 
      FROM eventos_calendario ec
      LEFT JOIN grupos g ON g.idgrupo = ec.idgrupo
      WHERE ec.idgrupo = ? OR g.nombre = 'general'`,
      [groupId]
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los eventos del grupo');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
