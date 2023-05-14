const express = require('express');
const app = express();

//bodyParser toma los datos del cuerpo de la solicitud HTTP y los convierte en un objeto JavaScript 
//accesible desde la solicitud.
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const mysql = require('mysql2/promise');
const PORT = process.env.PORT || 8000;
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","OPTIONS", "PUT", "DELETE"]
  },
  host: 'localhost',
  
});
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json()); // middleware para analizar los datos JSON en las solicitudes POST

const dbconfig = require('./dbconfig');

// Crear la conexión a la base de datos
const pool = mysql.createPool(dbconfig);

// rutas y lógica del servidor express
const noticiasRouter = require('./routes/news');
const loginRouter = require('./routes/auth');
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')
const chatRouter =require('./routes/chat');
const notesRouter=require('./routes/notes');
// Middleware para validar el token en las rutas protegidas
//app.use('/chat', verificarToken, chatRouter);

// Rutas públicas
app.use('/login', loginRouter);
app.use('/noticias', noticiasRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/messages', chatRouter);
app.use('/notes', notesRouter);

//evitar error al intentar cargar favicon.ico
app.use('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi servidor de Socket.io y API REST!');
});

//---------------------------------SOCKET.IO------------------------------//

// manejar conexiones de sockets entrantes
io.on('connection', (socket) => {
   console.log('Usuario conectado:', socket.id);

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
      io.to(data.iddestino).emit('private message', { message:data.mensaje, idorigen:data.idorigen });
      
      //io.emit('private message', { message:data.mensaje, idorigen:data.iddestino }) 
    });

  // desconectar el socket cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('El cliente se ha desconectado');
  });

  socket.on('get messages', (data) => {
    const idorigen = data.idorigen;
    const iddestino = data.iddestino;
    console.log(idorigen, iddestino);
    pool.query('SELECT * FROM mensajes WHERE (idorigen = ? AND iddestino = ?) OR (idorigen = ? AND iddestino = ?) ORDER BY fechahora ASC', [idorigen, iddestino, iddestino, idorigen])
      .then((result) => {
        const messages = result[0];
        io.to(socket.id).emit('messages', messages);
        console.log(messages)
    })
    .catch((error) => {
      console.error(`Error al recuperar los mensajes de la base de datos: ${error}`);
    });
});
});

//----------------------------------------------------------------------//

// iniciar el servidor
server.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto 8000');
});

