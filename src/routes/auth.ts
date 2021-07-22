const express = require('express')
const controller = require('../controllers/auth')

export const authRouter = express.Router()

authRouter.post('/', controller.create)
