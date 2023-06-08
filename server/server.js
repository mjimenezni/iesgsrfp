const express = require('express');
const app = express();


//bodyParser toma los datos del cuerpo de la solicitud HTTP y los convierte en un objeto JavaScript 
//accesible desde la solicitud.
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

const PORT = process.env.PORT || 8000;

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json()); // middleware para analizar los datos JSON en las solicitudes POST

const handleSockets = require('./socket');

// rutas y lógica del servidor express
const noticiasRouter = require('./routes/news');
const loginRouter = require('./routes/auth');
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')
const chatRouter =require('./routes/chat');
const notesRouter=require('./routes/notes');
const groupsRouter=require('./routes/groups');
const calendarRouter=require('./routes/calendar')
// Middleware para validar el token en las rutas protegidas
//app.use('/chat', verificarToken, chatRouter);

// Rutas públicas
app.use('/login', loginRouter);
app.use('/noticias', noticiasRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/messages', chatRouter);
app.use('/notes', notesRouter);
app.use('/groups', groupsRouter);
app.use('/events', calendarRouter);

//evitar error al intentar cargar favicon.ico
app.use('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi servidor de Socket.io y API REST!');
});

// Configuración de sockets
handleSockets(server);

// iniciar el servidor
server.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto 8000');
});

