import { Server } from 'socket.io';

export const ROOMS = new Map(); // roomId -> Set de userIds

export default function registerSocketEvents(socket) {
  // Evento: Criar sala
  socket.on('create room', (roomId) => {
    console.log(`🛠️ Sala criada: ${roomId}`);
    socket.join(roomId);
  });

  // Evento: Cadastrar usuário
  socket.on('register user', (username) => {
    console.log(`👤 Usuário registrado: ${username}`);
    socket.data.username = username;
  });

  socket.on('join room', ({roomId, userId}) => {
    socket.join(roomId);
    console.log(`👥 Socket ${socket.id} - ${userId} - entrou na sala ${roomId}`);

    // Enviar mensagem para todos da sala
    socket.to(roomId).emit('user joined', {
      user: socket.data.username || socket.id,
      room: roomId,
    });
  });
}

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

  socket.on('join room', roomId => {
    console.log('[servidor] join room recebido:', roomId);
    // lógica adicional aqui
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


// -------


