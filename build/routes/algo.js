"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.algoRouter = void 0;
const express = require('express');
const controller = require('../controllers/algo');
// import * as controller from '../controllers/auth';
exports.algoRouter = express.Router({ mergeParams: true });
/** POST /api/algo */
// algoRouter.post('/', controller.create);
exports.algoRouter.post('/', controller.create);
exports.algoRouter.get('/', controller.show);
exports.algoRouter.get('/index', controller.index);
exports.algoRouter.put('/:algoId', controller.update);
