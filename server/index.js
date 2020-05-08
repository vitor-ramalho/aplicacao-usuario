const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser } = require('./users.js')

const PORT = process.env.PORT || 5000

const router = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

function getDate() {
    var dataAtual = new Date();
    var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();


    var formatDate = dia + "/" + mes + "/" + ano + " "

    return formatDate;
}

function getHours() {
    var dataAtual = new Date();
    var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();

    var formatHour = hora + ':' + minuto

    return formatHour
}

io.on('connection', (socket) => {
    console.log('We have a new connection');

    socket.on('join', ({ name }, callback) => {
        const { error, user } = addUser({ id: socket.id, name });

        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the chat` });
        socket.broadcast.to(user).emit('message', { user: 'admin', text: `${user.name}, has joined` });
        socket.join(user)

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        message = "[" + getDate() + ' ' + user.name + ' ' + getHours() + ']' + '  : ' + message

        io.to(user).emit('message', { user: user.name, text: message, });

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user).emit('message', { user: 'admin', text: `${user.name} has left` });
        }
    })
})

app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`))