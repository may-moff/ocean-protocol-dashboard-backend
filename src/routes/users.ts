import { algoRouter } from './algo'
import { jobsRouter } from './jobs'
const express = require('express')
const controller = require('../controllers/users')
const authenticateToken = require('../middlewares/authenticateToken')

export const userRouter = express.Router({ mergeParams: true })

// Unauthenticated routes
userRouter.post('/', controller.create)
userRouter.get('/', controller.find)

// Authenticated routes
userRouter.get('/:userId', authenticateToken, controller.get)
userRouter.patch('/:userId', authenticateToken, controller.patch)
userRouter.use('/:userId/algo/', authenticateToken, algoRouter)
userRouter.use('/:userId/jobs/', authenticateToken, jobsRouter)
