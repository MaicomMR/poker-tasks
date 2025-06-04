const { Server } = require('socket.io');

module.exports = function attachSocket(httpServer) {
  const io = new Server(httpServer);
  const rooms   = {};     // { roomId: { votes: { socketId: card } } }
  const members = {};     // { socketId: name }

  io.on('connection', socket => {
    socket.on('register-user', ({ roomId, name }) => {
      members[socket.id] = name;
      socket.join(roomId);
      rooms[roomId] ??= { votes: {} };
      io.to(roomId).emit('member-joined', { id: socket.id, name });
    });

    socket.on('vote', ({ roomId, card }) => {
        // ✅ Garantia de que a sala já existe
        if (!rooms[roomId]) {
          socket.emit('error-msg', 'Vote chegou antes de entrar na sala');
          return;              // sai sem tocar no objeto inexistente
        }
      
        // lógica normal
        rooms[roomId].votes[socket.id] = card;
        socket.to(roomId).emit('vote-update', {
          id: socket.id,
          name: members[socket.id]
        });
      });
      

    socket.on('reveal', roomId => {
      const result = Object.fromEntries(
        Object.entries(rooms[roomId].votes).map(
          ([id, card]) => [members[id] ?? id, card]
        )
      );
      io.to(roomId).emit('reveal-cards', result);
    });

    socket.on('reset', roomId => {
      rooms[roomId].votes = {};
      io.to(roomId).emit('reset-cards');
    });

    socket.on('disconnect', () => {
      const name = members[socket.id];
      delete members[socket.id];
      for (const roomId of socket.rooms) {
        if (rooms[roomId]) delete rooms[roomId].votes[socket.id];
        io.to(roomId).emit('member-left', { id: socket.id, name });
      }
    });
  });

  return io; // se quiser usar fora
};
