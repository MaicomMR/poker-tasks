// src/routes/web.routes.js
import { Router } from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = join(__dirname, '../../public'); // volta duas pastas

router.get('/', (_, res) => {
  res.sendFile(join(PUBLIC_PATH, 'index.html'));
});

router.get('/home', (_, res) => {
  res.sendFile(join(PUBLIC_PATH, 'home.html'));
});

export default router;