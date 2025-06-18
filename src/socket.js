import { Server } from 'socket.io';

export const ROOMS = new Map();

export default function registerSocketEvents(socket, io) {
  // Criar sala
  socket.on('create room', (roomId) => {
    console.log(`🛠️ Sala criada: ${roomId}`);
    socket.join(roomId);
    ROOMS.set(roomId, []);
  });

  // Registrar username (opcional)
  socket.on('register user', (username) => {
    console.log(`👤 Usuário registrado: ${username}`);
    socket.data.username = username;
  });

  // Entrar em sala
  socket.on('join room', ({ roomId, userId }) => {
    console.log(`👥 Socket ${socket.id} (${userId}) entrou na sala ${roomId}`);
    socket.join(roomId);

    if (!ROOMS.has(roomId)) {
      ROOMS.set(roomId, []);
    }

    const users = ROOMS.get(roomId);
    users.push({ id: socket.id, userId });
    ROOMS.set(roomId, users);

    console.log('io dentro do registerSocketEvents:', !!io);

    io.to(roomId).emit('update-users', users);
  });

  // Desconectar
  socket.on('disconnect', (reason) => {
    console.log(`🔴 Socket ${socket.id} desconectou. Motivo: ${reason}`);

    for (const [roomId, users] of ROOMS.entries()) {
      const updatedUsers = users.filter(user => user.id !== socket.id);

      if (updatedUsers.length !== users.length) {
        if (updatedUsers.length === 0) {
          ROOMS.delete(roomId);
          console.log(`🗑️ Sala ${roomId} foi removida (sem usuários).`);
        } else {
          ROOMS.set(roomId, updatedUsers);
          io.to(roomId).emit('update-users', updatedUsers);
        }
      }
    }
  });
}

export function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log(`✅ Novo usuário conectado: ${socket.id}`);
    registerSocketEvents(socket, io);
  });

  return io;
}

export function createSocketRoom(roomId, creatorId) {
  ROOMS.set(roomId, [{ id: creatorId, userId: creatorId }]);
}

export function addUserToRoom(roomId, userId) {
  const room = ROOMS.get(roomId);
  if (!room) return false;

  room.push({ id: userId, userId });
  ROOMS.set(roomId, room);
  return true;
}

export function checkIfRoomExists(roomId) {
  if (!ROOMS.has(roomId)) {
    console.log(`Criando sala ${roomId}`);
    ROOMS.set(roomId, []);
    return true;
  }

  console.log(`Sala ${roomId} já existe`);
  return false;
}
