"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express = require('express');
const controller = require('../controllers/auth');
// import * as controller from '../controllers/auth';
exports.authRouter = express.Router();
/** POST /api/auth */
// authRouter.post('/', controller.create);
exports.authRouter.post('/', controller.create);
