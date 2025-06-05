import { Router } from 'express';

/* validações  ─ cada arquivo permanece isolado em /requests */
import { createRoomRules } from '../requests/room.create.request.js';
import { joinRoomRules } from '../requests/room.join.request.js';
import { validate } from '../requests/validate.js';

/* controladores  ─ idem */
import { createRoom, joinRoom } from '../controllers/room.controller.js';
// import { joinRoom } from '../controllers/room.join.controller.js';

const router = Router();

router.post('/rooms', createRoomRules, validate, createRoom);
router.post('/rooms/:roomId/join', joinRoomRules, validate, joinRoom);

export default router;
