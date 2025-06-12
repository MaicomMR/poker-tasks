import { Server } from 'socket.io';

export const ROOMS = new Map(); // roomId -> Set de userIds

export function createSocketRoom(roomId, creatorId) {
  ROOMS.set(roomId, new Set([creatorId]));
}

export function addUserToRoom(roomId, userId) {
  console.log(`Buscando sala ${roomId}`)
  const room = ROOMS.get(roomId);

  if (!room) return false;
  room.add(userId);
  return true;
}

export function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    socket.on('register-user', ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`Usuário ${userId} entrou na sala ${roomId}`);
    });

    socket.on('disconnect', () => {
      for (const [roomId, users] of ROOMS) {
        users.delete(socket.id);
        if (users.size === 0) ROOMS.delete(roomId);
      }
    });
  });
}

export function checkifRoomExists(roomId) {
  if (!ROOMS.has(roomId)) {
    console.log(`Criando sala ${roomId}`);
    ROOMS.set(roomId, new Set());
    return true;
  }

  console.log(`${roomId} - Sala já existe`);
  return false;
}