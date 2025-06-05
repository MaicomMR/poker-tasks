// src/controllers/room.controller.js
import crypto from 'node:crypto';

const ROOMS = new Set();                       // memória; troque por DB/Redis depois

function generateId() {
  let id;
  do {
    id = crypto.randomBytes(4).toString('base64url'); // 6 caracteres A-Z a-z 0-9
  } while (ROOMS.has(id));
  return id;
}

export function createRoom(req, res) {
  const roomId = generateId();
  ROOMS.add(roomId);
  return res.status(201).json({ roomId });
}

export function joinRoom(req, res) {
  const { roomId } = req.params;
  if (!ROOMS.has(roomId)) {
    return res.status(404).json({ error: 'Room not found' });
  }
  return res.json({ ok: true });
}
