var socket = io();   

// client connection
socket.on('connection', function () {
    console.log('connected to user client');
});  

// emit client createMessage data
socket.emit('createMessage', {
    from: 'Nupoor',
    text: 'Yes that works for me',
    createdAt: 123
});

// setup newMessage event on sever side
socket.on('newMessage', function(message) {
    console.log('new message from client', message);
});

// disconnect client
socket.on('disconnect', function () {
    console.log('disconnected from user client');
});