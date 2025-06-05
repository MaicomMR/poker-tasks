// src/routes/api.routes.js
import { Router } from 'express';
import { createRoom, joinRoom } from '../controllers/room.create.controller.js';
import { createRoomRules } from '../requests/room.create.request.js';
import { joinRoomRules } from '../requests/room.join.request.js';
import { validate } from '../requests/validate.js';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = join(__dirname, '../../public');

router.get('/', (_, res) => {
  res.sendFile(join(PUBLIC_PATH, 'home.html'));     // <- página de escolha
});

router.post('/rooms', createRoomRules, validate, createRoom);
router.post('/rooms/:roomId/join', joinRoomRules, validate, joinRoom);

export default router;
