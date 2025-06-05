// src/requests/joinRoom.request.js
import { param } from 'express-validator';

export const joinRoomRules = [
  param('roomId')
    .isAlphanumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('invalid roomId'),
];
