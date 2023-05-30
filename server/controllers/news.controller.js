const dbconnection = require('../dbconnection');


exports.getAllNews =  async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('SELECT * FROM noticias');
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las noticias');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getNewById = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM noticias WHERE idnoticia = ?',
      [req.params.idnoticia]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Noticia no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la noticia');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.createNew = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();

    if (!req.body) {
        return res.status(400).send('No se recibieron los datos de la noticia');
      }
    const { titulo, contenido, fecha } = req.body || {};

    //Se establece imagen por defecto si no se recibe ninguna
    const imagen = req.file ? 'assets/img/news/' + req.file.originalname : 'assets/img/news/noticia.jpg';
    
    const [results] = await connection.execute(
      'INSERT INTO noticias (contenido, fecha, imagen,titulo) VALUES (?, ?, ?, ?)',
      [contenido, fecha, imagen, titulo]
    );
    res.json({ idnoticia: results.insertId, contenido, fecha, imagen, titulo });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la noticia'+ error.message);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.editNew = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const { titulo, contenido, fecha } = req.body ;
    const imagen = req.file ? 'assets/img/news/' + req.file.originalname : '';
     const [results] = await connection.execute(
      'UPDATE noticias SET titulo = ?, contenido = ?, fecha = ?, imagen=? WHERE idnoticia = ?',
      [titulo, contenido, fecha, imagen, req.params.idnoticia]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la noticia');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteNew = async (req, res) => {
  const id = req.params.idnoticia;
  let connection;
  try {
    connection = await dbconnection.getConnection();

    // Eliminamos la noticia
    const [result] = await connection.execute('DELETE FROM noticias WHERE idnoticia = ?', [id]);

    // Comprobamos si se ha eliminado alguna noticia
    if (result.affectedRows === 0) {
      res.status(404).send('Noticia no encontrada');
    } else {
      res.status(204).send(); // Enviamos una respuesta vacía si se ha eliminado correctamente
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la noticia');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};