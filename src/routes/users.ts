import { algoRouter } from './algo'
import { jobsRouter } from './jobs'
const express = require('express')
const config = require('../config')
const controller = require('../controllers/users')
const jwt = require('express-jwt')
const authenticateToken = require('../middlewares/authenticateToken')

export const userRouter = express.Router({ mergeParams: true })

/** GET /api/users */
userRouter.get('/', authenticateToken, controller.find)

/** POST /api/users */
userRouter.post('/', controller.create)

/** GET /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').get(jwt(config), controller.get);
userRouter.get('/:userId', jwt(config), controller.get)

/** PATCH /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').patch(jwt(config), controller.patch);
userRouter.patch('/:userId', jwt(config), controller.patch)

userRouter.use('/:userId/algo/', algoRouter)
userRouter.use('/:userId/jobs/', jobsRouter)
