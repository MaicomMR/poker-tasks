// src/controllers/room.controller.js
import crypto from 'node:crypto';

// armazena as salas em memória (troque por Redis ou DB se precisar)
const ROOMS = new Set();

export function createRoom(req, res) {
  // id opcional vindo do body; se não vier, gere
  let roomId = req.body.roomId;
  while (!roomId || ROOMS.has(roomId)) {
    roomId = crypto.randomBytes(3).toString('base64url'); // 6 chars, A-Z0-9, seguro p/ URL
  }
  ROOMS.add(roomId);
  return res.status(201).json({ roomId });
}

export function joinRoom(req, res) {
  const { roomId } = req.params;
  if (!ROOMS.has(roomId)) {
    return res.status(404).json({ error: 'Room not found' });
  }
  // nada a fazer do lado HTTP; o join real acontece via Socket.IO
  return res.json({ ok: true });
}
