// src/requests/createRoom.request.js
import { body } from 'express-validator';

export const createRoomRules = [
  body('roomId')
    .optional()
    .isAlphanumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('roomId must be 6 alphanumeric chars'),
];
