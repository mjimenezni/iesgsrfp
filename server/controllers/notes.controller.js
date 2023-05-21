const dbconnection = require('../dbconnection');

exports.getAllNotes = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('SELECT * FROM notas');
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las notas');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getNoteById = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM notas WHERE idnota = ?',
      [req.params.idnota]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Nota no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la nota');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getGroupNotes = async (req, res) => {
  let connection;
  const idnota = req.params.idnota;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute(
      'SELECT grupos.nombre FROM notas_grupo JOIN grupos ON notas_grupo.idgrupo = grupos.idgrupo WHERE notas_grupo.idnota = ?',
      [idnota]
    );
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).send('Nota no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los grupos de la nota');
  }finally {
    if (connection) {
      connection.release();
    }
  }

};

exports.createNote = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();

    if (!req.body) {
        return res.status(400).send('No se recibieron los datos de la nota');
      }
    const { titulo, contenido, fecha} = req.body || {};
    
    const [results] = await connection.execute(
      'INSERT INTO notas (contenido, fecha, titulo) VALUES (?, ?, ?)',
      [contenido, fecha, titulo]
    );
    res.json({ idnota: results.insertId, contenido, titulo });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la nota'+ error.message);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.editNote = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const { titulo, contenido, fecha } = req.body;
    await connection.execute(
      'UPDATE notas SET titulo = ?, contenido = ?, fecha = ? WHERE idnota = ?',
      [titulo, contenido, fecha, req.params.idnota]
    );
 
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la nota');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteNote = async (req, res) => {
  const id = req.params.idnota;
  console.log(id);
  let connection;
  try {
    connection = await dbconnection.getConnection();

    // Eliminamos la nota
    const [result] = await connection.execute('DELETE FROM notas WHERE idnota = ?', [id]);

    // Comprobamos si se ha eliminado alguna nota
    if (result.affectedRows === 0) {
      res.status(404).send('Nota no encontrada');
    } else {
      res.status(204).send(); // Enviamos una respuesta vacía si se ha eliminado correctamente
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la nota');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};