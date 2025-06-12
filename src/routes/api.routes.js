import { Router } from 'express';
import { checkUser, createRoom, joinRoom } from '../controllers/room.controller.js';

const router = Router();

console.log('Router is loaded.');
router.post('/room/create', createRoom);
router.post('/room/:roomId/join', joinRoom);
router.post('/room/checkUser', checkUser);

export default router;
