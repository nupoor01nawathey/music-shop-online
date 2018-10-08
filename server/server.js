const path      = require('path'),
      http      = require('http'),
      express   = require('express'),
      socketIO  = require('socket.io');

const app       = express();

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const server = http.createServer(app);
const io     = socketIO(server);


io.on('connection', (socket) => {
    console.log('new user connected');

    // listen to createMessage event setup in CLIENT
    socket.on('createMessage', (message) => {
        console.log('create message event', message);
    });

    // listen to newMessage event setup in SERVER
    socket.emit('newMessage', {
        from: 'CPK',
        text: 'What now??',
        createdAt: 123
    });

    // disconnect server
    socket.on('disconnect', (socket) => {
        console.log('disconnected from user');
    });    
});


const PORT = process.env.PORT || 3000 ;
server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});