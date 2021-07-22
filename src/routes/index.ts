const express = require('express')
const authenticateToken = require('../middlewares/authenticateToken')
const { authRouter } = require('./auth')
const { userRouter } = require('./users')
const { algoRouter } = require('./algo')

const routes = express.Router()

routes.use('/auth', authRouter)
routes.use('/users', userRouter)

module.exports = routes
