const dbconnection = require('../dbconnection');
// Importamos el módulo de bcrypt para cifrar contraseñas
const bcrypt = require('bcryptjs');
// Importamos el módulo de jsonwebtoken para generar tokens JWT
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  let connection;
 
  try {
    // Obtenemos el email y el password del body del request
    const { email, password } = req.body;

    // Obtenemos una conexión a la base de datos
    connection = await dbconnection.getConnection();

        // Realizamos la consulta a la base de datos para obtener el usuario con el email especificado
    const [rows] = await connection.execute(
      'SELECT idusuario, password, nombre, isAdmin, avatar FROM usuarios WHERE email = ?',
      [email]
    );

    // Si no se encontró ningún usuario con ese email, devolvemos un error de credenciales inválidas
    if (rows.length !== 1) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Obtenemos el usuario de la base de datos
    const user = rows[0];

    // Comparamos la contraseña introducida por el usuario con la contraseña cifrada almacenada en la base de datos
    //const isMatch = await bcrypt.compare(password, user.password);

    // Si las contraseñas no coinciden, devolvemos un error de credenciales inválidas
    /*if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }*/
    if (password !== user.password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generamos un token JWT con la información del usuario (idusuario e isAdmin)
    const token = jwt.sign(
      { idusuario: user.idusuario, isAdmin: user.isAdmin, nombre: user.nombre, avatar:user.avatar },
      'secreto', // Clave secreta para cifrar el token
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Devolvemos el token como respuesta
    res.json({ token });
  } catch (error) {
    // En caso de error, devolvemos un error genérico
    console.error(error);
    res.status(500).send('Error al autenticar al usuario');
  }finally {
    if (connection) {
      connection.release();
    }
  }
};

