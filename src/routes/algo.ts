const express = require('express')
const controller = require('../controllers/algo')
// import * as controller from '../controllers/auth';

export const algoRouter = express.Router({ mergeParams: true })

/** POST /api/algo */
// algoRouter.post('/', controller.create);
algoRouter.post('/', controller.create)
algoRouter.get('/', controller.show)
algoRouter.get('/index', controller.index)
algoRouter.put('/:algoId', controller.update)
