# Socket.io : Real-time communication in web development

## Overview
This a chat application with basic functionality which uses Socket.io for real-time communication.

## Demo
Link: [https://nj-chat-app.netlify.app/](https://nj-chat-app.netlify.app/)

| [![](https://i.imgur.com/emt5RPw.png)](https://nj-chat-app.netlify.app/) |
|:--:| 
| *User 1 Perspective* |

| [![](https://i.imgur.com/5KPDxzs.png)](https://nj-chat-app.netlify.app/) |
|:--:| 
| *User 2 Perspective* |

## What is Socket.io?
Socket.IO enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed. Socket.IO is built on top of the WebSockets API (Client side) and Node.js. It is one of the most depended upon library on npm (Node Package Manager).

Socket.IO is a JavaScript library for real-time web applications. It enables real-time, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for node.js. Both components have an identical API.

## Why Socket.IO?
Writing a real-time application with popular web applications stacks like LAMP (PHP) has traditionally been very hard. It involves polling the server for changes, keeping track of timestamps, and it is a lot slower than it should be.

Sockets have traditionally been the solution around which most real-time systems are architected, providing a bi-directional communication channel between a client and a server. This means that the server can push messages to clients. Whenever an event occurs, the idea is that the server will get it and push it to the concerned connected clients.

## Environment Setup
Before starting you need to have Node and npm(node package manager) installed. Here a is a link to help you in setting up the environment:

Link: [https://www.tutorialspoint.com/socket.io/socket.io_environment.htm](https://www.tutorialspoint.com/socket.io/socket.io_environment.htm)

## client.js
```js
const socket = io('http://localhost:8000');

//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio('tone.mp3');

//Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    audio.play();
}

//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined',name);

//If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`,'right');
})

//If a server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`,'left');
})

//If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`,'right');
})

//If the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    messageInput.value = '';
})
```
## Node Server (index.js)

```js
//Node server which will handle socket io connections
const io = require('socket.io')(8000)

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
})
```

## Made Using
[<img target="_blank" src="https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/HTML)
&nbsp;
[<img target="_blank" src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/CSS)
&nbsp;
[<img target="_blank" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
&nbsp;
[<img target="_blank" src="https://socket.io/css/images/logo.svg">](https://socket.io/)

## Deployment
[<img target="_blank" src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white">](https://www.netlify.com/)
&nbsp;
[<img target="_blank" src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white">](https://www.heroku.com/)






