import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import registerSocketEvents from '../src/socket.js';

import webRoutes from './routes/web.routes.js';
import apiRoutes from './routes/api.routes.js';
import registerRoomSocket from './sockets/room.handlers.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/', webRoutes);
app.use('/', apiRoutes);
app.use(cookieParser());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Novo socket conectado:', socket.id);
  registerSocketEvents(socket);
});

registerRoomSocket(io);

httpServer.listen(3000, () =>
  console.log('server running at http://localhost:3000')
);
