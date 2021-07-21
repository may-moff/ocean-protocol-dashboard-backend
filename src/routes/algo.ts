const express = require('express')
const controller = require('../controllers/algo')

export const algoRouter = express.Router({ mergeParams: true })

algoRouter.post('/', controller.create)
algoRouter.get('/', controller.show)
algoRouter.get('/index', controller.index)
algoRouter.put('/:algoId', controller.update)
