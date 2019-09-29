let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

var port = process.env.PORT || 3001;

let users = [];

io.on('connection', (socket) => {

    socket.on('disconnect', function() {
        let pos = users.findIndex(element => element.id === socket.id);
        if (pos > -1) {
            users.splice(pos, 1);
        }
        io.emit('users-changed', users);
    });

    socket.on('set-name', (name) => {
        socket.username = name;
        users.push({
            id: socket.id,
            userName: name
        });
        io.emit('users-changed', users);
    });

    socket.on('send-message-all-users', (message) => {
        io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});
    });

    socket.on('private-message', (data) => {
        socket.broadcast.to(data.id).emit('send-private-message', {message: data.message, user: data.userName});
    });
});

server.listen(port, function() {
    console.log('listen on port: http://localhost:' + port);
});