// src/controllers/room.controller.js
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createSocketRoom, addUserToRoom, checkIfRoomExists } from '../socket.js';

const ROOMS = new Map(); // roomId -> [socketId]

export function createRoom(req, res) {
  const { username } = req.body;
  console.log(username)

  if (!username) {
    return res.status(400).json({ error: "Username obrigatório" });
  }

  const roomId = generateRoomId();

  console.log('createRoom - ', 'roomId: ', roomId, 'userId: ', username);

  createSocketRoom(roomId, username);
  saveCookies(res, roomId, username);

  return res.status(201).json({ roomId, username, redirectTo: `/room/${roomId}` });
}

export function joinRoom(req, res) {
  const { username } = req.body;
  const { roomId } = req.params;

  const wasCreated = checkIfRoomExists(roomId);

  res.cookie('roomId', roomId, { maxAge: 86400000, httpOnly: false });
  res.cookie('username', username, { maxAge: 86400000, httpOnly: false });

  console.log('roomId:', roomId, '- username:', username, wasCreated ? '[sala criada]' : '[sala existente]');

  saveCookies(res, roomId, username); // aqui está a mágica
  return res.status(200).json({ username, roomId, redirectTo: `/room/${roomId}` });
}

export function showRoom(req, res) {

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../../public/room.html');

  res.sendFile(filePath);
}

export function saveCookies(res, roomId, userId) {
  const cookieOptions = {
    maxAge: 86400000, // 1 dia
    httpOnly: false,
    path: '/',
  };

  if (roomId) res.cookie('roomId', roomId, cookieOptions);
  if (userId) res.cookie('userId', userId, cookieOptions);
}

export function checkUser() {
  console.log('chegou aqui')
}

function generateRoomId(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, chars.length);
    id += chars[randIndex];
  }
  return id;
}
