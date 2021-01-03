//Node server which will handle socket io connections
// const io = require('socket.io')(8000)
// 'use strict';

// const express = require('express');
// const socketIO = require('socket.io');

// const PORT = process.env.PORT || 8000;
// const INDEX = '/nodeserver/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = socketIO(server);

var PORT = process.env.PORT || 8000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

server.listen(PORT, function() {
  console.log('Chat server running');
});

var io = require('socket.io')(server);

const users = {};

io.on('connection', socket =>{
    //If any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    //If someone sends a message, broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //If someone leaves the chat, let others know....(disconnect is a built-in event)
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);