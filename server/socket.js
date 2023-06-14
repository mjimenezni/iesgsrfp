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
    
      // Actualizar el campo "leido" a 1 de la conversación obtenida
      pool.query('UPDATE mensajes SET leido = 1 WHERE idorigen = ? AND iddestino= ?',[iddestino,idorigen])
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

    socket.on('getUnreadMessagesCount', async (data) => {
      const iddestino = data.iddestino;
     
      try {
        // Obtener el número de mensajes no leídos para cada usuario
        const [results] = await pool.query('SELECT idorigen, COUNT(*) AS totalNoleidos FROM mensajes WHERE iddestino = ? AND leido = 0 GROUP BY idorigen', [iddestino]);
        const unreadMessagesCount = {};

        for (const row of results) {
          const { idorigen, totalNoleidos } = row;
          unreadMessagesCount[idorigen] = totalNoleidos;
        }
       
        // Enviar el número de mensajes no leídos por cada usuario al cliente
        io.to(socket.id).emit('unreadMessagesCount', unreadMessagesCount);
      } catch (error) {
        console.error(`Error al obtener el número de mensajes no leídos por cada usuario: ${error}`);
      }
    });

  });
}


module.exports = handleSockets;