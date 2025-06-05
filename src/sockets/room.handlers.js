// src/sockets/room.handlers.js
import { Server } from 'socket.io';

export default function registerRoomSocket(io /** @type {Server} */) {
  io.on('connection', (socket) => {
    socket.on('create room', (roomId, ack = () => {}) => {
      socket.join(roomId);
      ack(roomId);
      io.to(roomId).emit('system', `🆕 Sala ${roomId} criada`);
    });

    socket.on('join room', (roomId, ack = () => {}) => {
      socket.join(roomId);
      ack({ ok: true });
      io.to(roomId).emit('system', '➕ Alguém entrou na sala');
    });

    socket.on('chat message', ({ roomId, message }) => {
      io.to(roomId).emit('chat message', message);
    });
  });
}
