const express = require('express');
const app = express();

//bodyParser toma los datos del cuerpo de la solicitud HTTP y los convierte en un objeto JavaScript 
//accesible desde la solicitud.
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const mysql = require('mysql2');
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

//const dbconfig = require('./dbconfig');

// Crear la conexión a la base de datos
//const connection = mysql.createConnection(dbconfig);

// rutas y lógica del servidor express
const noticiasRouter = require('./routes/news');
const loginRouter = require('./routes/auth');
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')

// Middleware para validar el token en las rutas protegidas
//app.use('/chat', verificarToken, chatRouter);

// Rutas públicas
app.use('/login', loginRouter);
app.use('/noticias', noticiasRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);

//evitar error al intentar cargar favicon.ico
app.use('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi servidor de Socket.io y API REST!');
});

// middleware para validar el token JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, 'secreto', (error, decoded) => {
    if (error) {
      return res.status(401).json({ mensaje: 'Token inválido.' });
    }
    req.userId = decoded.idusuario;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}
//---------------------------------SOCKET.IO------------------------------//

// manejar conexiones de sockets entrantes
io.on('connection', (socket) => {
  console.log('Un nuevo cliente se ha conectado');

  // emitir un mensaje al cliente cuando se conecta
  socket.emit('mensaje', '¡Hola, cliente! Bienvenido a mi servidor de Socket.io.');

 
  // manejar los mensajes enviados por el cliente
  socket.on('mensaje', (data) => {
    console.log(`El cliente ha enviado el mensaje: ${data}`);
  });

  // desconectar el socket cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('El cliente se ha desconectado');
  });
});

//----------------------------------------------------------------------//

// iniciar el servidor
server.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto 8000');
});

