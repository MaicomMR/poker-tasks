import { Router } from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../../public');

router.get('/', (_, res) => res.sendFile(join(PUBLIC, 'home.html')));

router.get('/room/:roomId', (_, res) =>
  res.sendFile(join(PUBLIC, 'room.html'))
);

export default router;
