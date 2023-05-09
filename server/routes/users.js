const express = require('express');
const router = express.Router();
const dbconnection = require('../dbconnection');

// Endpoint GET para obtener todos los usuarios
router.get('/', async (req, res) => {
     let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('SELECT * FROM usuarios');
    //console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  } finally {
    if (connection) {
      connection.release();
    }
}
});

// Endpoint para obtener un usuario por su id
router.get('/:idusuario', async (req, res) => {
  const id = req.params.idusuario;
   let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results]  = await connection.execute('SELECT * FROM usuarios WHERE idusuario = ?', [id]);
    if (results.length === 0) {
      return res.status(404).send(`Usuario con id ${id} no encontrado`);
    }
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al obtener el usuario con id ${id}`);
  }finally {
    if (connection) {
      connection.release();
    }
  }
});

// Crear un usuario
router.post('/', async (req, res) => {
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
});

// Actualizar un usuario por su id
router.put('/:idusuario', async (req, res) => {
  const id = req.params.idusuario;
  const { nombre, email, password } = req.body;
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute('UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE idusuario = ?', [nombre, email, password, id]);
    if (results.affectedRows === 0) {
      return res.status(404).send(`Usuario con id ${id} no encontrado`);
    }
    res.json({ message: `Usuario con id ${id} actualizado exitosamente` });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al actualizar el usuario con id ${id}`);
  }finally {
    if (connection) {
      connection.release();
    }
  }
});

// Eliminar un usuario por su id
router.delete('/:idusuario', async (req, res) => {
  const id = req.params.idusuario;
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [result] = await connection.execute('DELETE FROM usuarios WHERE idusuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send(`Usuario con id ${id} no encontrado`);
    }
    res.json({ message: `Usuario con id ${id} eliminado exitosamente` });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al eliminar el usuario con id ${id}`);
  }finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
