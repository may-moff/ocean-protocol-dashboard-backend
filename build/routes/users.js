"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const algo_1 = require("./algo");
const jobs_1 = require("./jobs");
const express = require('express');
const config = require('../config');
const controller = require('../controllers/users');
const jwt = require('express-jwt');
exports.userRouter = express.Router({ mergeParams: true });
/** GET /api/users */
exports.userRouter.get('/', controller.find);
/** POST /api/users */
exports.userRouter.post('/', controller.create);
/** GET /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').get(jwt(config), controller.get);
exports.userRouter.get('/:userId', jwt(config), controller.get);
/** PATCH /api/users/:userId */
/** Authenticated route */
// userRouter.route('/:userId').patch(jwt(config), controller.patch);
exports.userRouter.patch('/:userId', jwt(config), controller.patch);
exports.userRouter.use('/:userId/algo/', algo_1.algoRouter);
exports.userRouter.use('/:userId/jobs/', jobs_1.jobsRouter);
