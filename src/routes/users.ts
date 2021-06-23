const express = require('express');
const config = require('../config');
const controller = require('../controllers/users');
const jwt = require('express-jwt');

export const userRouter = express.Router();

/** GET /api/users */
userRouter.get('/', controller.find);

/** POST /api/users */
userRouter.post('/', controller.create);

/** GET /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').get(jwt(config), controller.get);
userRouter.get('/:userId', jwt(config), controller.get);

/** PATCH /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').patch(jwt(config), controller.patch);
userRouter.patch('/:userId', jwt(config), controller.patch);
