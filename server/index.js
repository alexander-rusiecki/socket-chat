const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://socket-chat-rho.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', socket => {
  // connect
  const count = io.engine.clientsCount;
  console.log(`User id: ${socket.id} is connected`);
  console.log(`Total users logged in: ${count}`);

  // disconnect
  socket.on('disconnect', reason => {
    console.log(`User id: ${socket.id} is disconnected`);
    console.log(`Reason: ${reason}`);
  });

  // join room
  socket.on('join-room', ({ username, roomName }) => {
    socket.join(roomName);
    console.log(`${username} joined room ${roomName}`);
  });

  // send message
  socket.on(
    'send-message',
    ({ username, roomName, message, createdAt, id }) => {
      socket.to(roomName).emit('receive-message', {
        username,
        roomName,
        message,
        createdAt,
        id,
      });
    }
  );
});

httpServer.listen(process.env.PORT, () => console.log('Socket open...'));
