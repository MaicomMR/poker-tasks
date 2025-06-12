import { Router } from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRoom, joinRoom, showRoom } from '../controllers/room.controller.js';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../../public');

router.get('/', (_, res) => res.sendFile(join(PUBLIC, 'home.html')));

router.get('/room/:roomId', showRoom);

router.get('/room/:roomId/join', (req, res) =>
  joinRoom(req, res)
);

export default router;
