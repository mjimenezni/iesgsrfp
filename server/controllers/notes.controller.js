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
      'SELECT * FROM notas_grupo JOIN grupos ON notas_grupo.idgrupo = grupos.idgrupo WHERE notas_grupo.idnota = ?',
      [idnota]
    );
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).send('Grupos de la nota no encontrados');
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
    const { titulo, contenido, fecha, grupos} = req.body || {};
    
    // Inicia una transacción
    await connection.beginTransaction();

    // Inserta la nota en la tabla notas
    const [noteResult] = await connection.execute(
      'INSERT INTO notas (contenido, fecha, titulo) VALUES (?, ?, ?)',
      [contenido, fecha, titulo]
    );

    const noteId = noteResult.insertId;

    // Inserta las relaciones en la tabla notas_grupo
    for (const grupoId of grupos) {
      await connection.execute(
        'INSERT INTO notas_grupo (idnota, idgrupo) VALUES (?, ?)',
        [noteId, grupoId]
      );
    }

    // Confirma la transacción
    await connection.commit();
    res.json({ idnota: noteResult.insertId, contenido, titulo });
    
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
    if (!req.body) {
        return res.status(400).send('No se recibieron los datos de la nota');
      }
    const { titulo, contenido, fecha, grupos } = req.body;

     // Inicia una transacción
    await connection.beginTransaction();

    // Elimina las relaciones existentes en la tabla notas_grupo
    await connection.execute('DELETE FROM notas_grupo WHERE idnota = ?', [req.params.idnota]);

    //Actualiza la nota
    const [noteResult] = await connection.execute(
      'UPDATE notas SET titulo = ?, contenido = ?, fecha = ? WHERE idnota = ?',
      [titulo, contenido, fecha, req.params.idnota]
    );
    //const noteId = noteResult.insertId;

    // Inserta las relaciones en la tabla notas_grupo
    for (const grupoId of grupos) {
      await connection.execute(
        'INSERT INTO notas_grupo (idnota, idgrupo) VALUES (?, ?)',
        [req.params.idnota, grupoId]
      );
    }

    // Confirma la transacción
    await connection.commit();
 
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
 
  let connection;
  try {
    connection = await dbconnection.getConnection();

     // Obtener los grupos asociados a la nota
    const [notaGrupoResult] = await connection.execute(
      'SELECT idgrupo FROM notas_grupo WHERE idnota = ?',
      [id]
    );

    // Eliminar las asociaciones entre la nota y sus grupos
    await connection.execute('DELETE FROM notas_grupo WHERE idnota = ?', [id]);


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

exports.getNotesByGroupId = async (req, res) => {
  let connection;
  try {
    const groupId = req.params.idgrupo; // Obtener el ID del grupo desde los parámetros de la solicitud

    connection = await dbconnection.getConnection();
    // Consulta para obtener las notas asociadas al ID de grupo específico
    const [notesResult] = await connection.execute(
      'SELECT n.idnota, n.titulo, n.contenido, n.fecha ' +
      'FROM notas n ' +
      'INNER JOIN notas_grupo ng ON n.idnota = ng.idnota ' +
      'WHERE ng.idgrupo = ? OR ng.idgrupo IN (SELECT idgrupo FROM grupos WHERE nombre = "general")',
      [groupId]
    );

    const notes = notesResult.map((row) => ({
      idnota: row.idnota,
      titulo: row.titulo,
      contenido: row.contenido,
      fecha: row.fecha
    }));

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los eventos del grupo');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};