let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

var port = process.env.PORT || 3001;

io.on('connection', (socket) => {
    socket.on('disconnect', function() {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });

    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('user-changed', {user: name, event: 'joined'});
    });

    socket.on('send-message', (message) => {
        io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});
    });
});

server.listen(port, function() {
    console.log('listen on port: http://localhost:' + port);
});