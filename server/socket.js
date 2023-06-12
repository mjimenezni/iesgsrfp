const socketIO  = require('socket.io');
const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');

// Crear la conexión a la base de datos
const pool = mysql.createPool(dbconfig);

function handleSockets(server) {
  const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","OPTIONS", "PUT", "DELETE"]
  },
  host: 'localhost',
});

// manejar conexiones de sockets entrantes
  io.on('connection', (socket) => {
    //console.log('Usuario conectado:', socket.id);
    const token = socket.handshake.auth.token;
    socket.join(token);
  
    socket.on('private message', (data) => {
      console.log(`message: ${data.mensaje}, fromUserId: ${data.idorigen}, toUserId: ${data.iddestino}`);
      // Insertar el mensaje en la base de datos
      pool.query('INSERT INTO mensajes (idorigen, iddestino, mensaje) VALUES (?, ?, ?)', [data.idorigen, data.iddestino, data.mensaje])
        .then((result) => {
        //console.log(`Mensaje almacenado en la base de datos: ${data.mensaje}`);
      })
    .catch((error) => {
      console.error(`Error al almacenar el mensaje en la base de datos: ${error}`);
    });
    // Emitir el mensaje solo al usuario seleccionado
      io.to(data.iddestino).emit('private message', { mensaje:data.mensaje, idorigen:data.idorigen, iddestino:data.iddestino, fechahora:new Date() });
      //console.log("usuario al que envío ", data.iddestino)
      
    });

    // desconectar el socket cuando el cliente se desconecta
    socket.on('disconnect', () => {
      console.log('El cliente se ha desconectado');
    });

    socket.on('get messages', (data) => {
      const idorigen = data.idorigen;
      const iddestino = data.iddestino;

      // Actualizar el campo "leido" a 1 para los mensajes del usuario actual
      pool.query('UPDATE mensajes SET leido = 1 WHERE iddestino = ?',[iddestino])
      .then(() => {
        // Obtener los mensajes de la base de datos
        pool.query('SELECT * FROM mensajes WHERE (idorigen = ? AND iddestino = ?) OR (idorigen = ? AND iddestino = ?) ORDER BY fechahora ASC', [idorigen, iddestino, iddestino, idorigen])
            .then((result) => {
              const messages = result[0];
              io.to(socket.id).emit('messages', messages);
              //console.log(messages)
              })
            .catch((error) => {
              console.error(`Error al recuperar los mensajes de la base de datos: ${error}`);
            });
        })
      .catch((error) => {
          console.error(`Error al actualizar el campo "leido" en la base de datos: ${error}`);
      });
    });
  });
}


module.exports = handleSockets;