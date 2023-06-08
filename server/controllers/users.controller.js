const dbconnection = require('../dbconnection');
// Importamos el módulo de jsonwebtoken para generar tokens JWT
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
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
};

exports.getUserById = async (req, res) => {
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
};

exports.createUser = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    
    if (!req.body) {
        return res.status(400).send('No se recibieron los datos del usuario');
      }
    const {  email, nombre, password, isAdmin, idgrupo } = req.body || {};
    
    //Se establece avatar por defecto
    const avatar = 'assets/img/avatar/ava1-bg.webp';
      
    const [results] = await connection.execute('INSERT INTO usuarios (nombre, email, password, isAdmin, avatar,idgrupo) VALUES (?, ?, ?, ?,?,?)', [nombre, email, password,isAdmin,avatar,idgrupo]);
   res.json({ idusuario: results.insertId, email, nombre, password, isAdmin,avatar,idgrupo});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.editUser = async (req, res) => {
  const id = req.params.idusuario;
  const { nombre, email, isAdmin, ape1,ape2, telefono, fecha_nac, avatar,idgrupo } = req.body;
  let connection;
  try {
    connection = await dbconnection.getConnection();
    let updateQuery = 'UPDATE usuarios SET nombre = ?';
    const updateValues = [nombre];

    if (ape1 !== undefined) {
      updateQuery += ', ape1 = ?';
      updateValues.push(ape1);
    }
     if (ape2 !== undefined) {
      updateQuery += ', ape2 = ?';
      updateValues.push(ape2);
    }
    if (isAdmin !== undefined) {
      updateQuery += ', isAdmin = ?';
      updateValues.push(isAdmin);
    }
    if (email !== undefined) {
      updateQuery += ', email = ?';
      updateValues.push(email);
    }
     if (telefono !== undefined) {
      updateQuery += ', telefono = ?';
      updateValues.push(telefono);
    }

    if (fecha_nac !== undefined) {
      updateQuery += ', fecha_nac = ?';
      updateValues.push(fecha_nac);
    }
     if (avatar !== undefined) {
      updateQuery += ', avatar = ?';
      updateValues.push(avatar);
    }
      if (idgrupo !== undefined) {
      updateQuery += ', idgrupo = ?';
      updateValues.push(idgrupo);
    }

    updateQuery += ' WHERE idusuario = ?';
    updateValues.push(id);
    const [results] = await connection.execute(updateQuery, updateValues);
    if (results.affectedRows === 0) {
      return res.status(404).send(`Usuario con id ${id} no encontrado`);
    }
    
     // Generamos un nuevo token JWT con la información del usuario (idusuario e isAdmin)
    const token = jwt.sign(
      { idusuario: id, isAdmin: isAdmin, nombre: nombre, avatar:avatar, idgrupo:idgrupo },
      'secreto', // Clave secreta para cifrar el token
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Devolvemos el token como respuesta
    res.json({ token });
  } catch (error) {
    console.error("Error al editar un usuario",error);
    res.status(500).send(`Error al actualizar el usuario con id ${id}`);
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteUser = async (req, res) => {
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
};

exports.changePassword = async (req, res) => {
  let connection;

  try {
    // Obtenemos el email y la nueva contraseña del body del request
    const { email, newPassword } = req.body;

    // Obtenemos una conexión a la base de datos
    connection = await dbconnection.getConnection();

    // Actualizamos la contraseña del usuario en la base de datos
    const [results] = await connection.execute(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [newPassword, email]
    );

    // Verificamos si se actualizó correctamente la contraseña
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolvemos una respuesta exitosa
    res.json({ success: true });
  } catch (error) {
    // En caso de error, devolvemos un error genérico
    console.error(error);
    res.status(500).send('Error al cambiar la contraseña');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

