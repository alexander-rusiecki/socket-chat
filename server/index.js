const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  socket.on('chat message', msg => {
    console.log(msg);
  });
});

httpServer.listen(4000, () => console.log('RUNNING...'));
