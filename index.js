let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

var port = process.env.PORT || 3001;

let users = [];

io.on('connection', (socket) => {
    socket.emit('first-connection', users);

    socket.on('disconnect', () => {
        const pos = users.findIndex(element => element.id === socket.id);
        if (pos > -1) {
            io.emit('logout-user', users[pos]);
            users.splice(pos, 1);
        }
    });

    socket.on('login-user', (user) => {
        users.push({ id: socket.id, userName: user });
        socket.emit('my-id', { id: socket.id });
        socket.broadcast.emit('new-user', { id: socket.id, userName: user });
    });

    socket.on('send-private-message', (message) => {
        socket.broadcast.to(message.idTarget).emit('private-message', { idSender: message.idSender, message: message.text, senderName: message.senderName });
    });

    socket.on('send-public-message', (message) => {
        io.emit('public-message', { idSender: message.idSender, message: message.message, senderName: message.senderName });
    });
});

server.listen(port, function() {
    console.log('listen on port: http://localhost:' + port);
});