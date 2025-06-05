// src/server.js
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import webRoutes from './routes/web.routes.js';

const app = express();

/* Arquivos estáticos (css, js do front) em /public */
app.use(express.static('public'));

/* Rotas HTTP */
app.use('/', webRoutes);

/* WebSocket */
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log(msg);
  });
});

httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
