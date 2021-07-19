"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.busRouter = void 0;
const express = require('express');
const controller = require('../controllers/bus');
// import * as controller from '../controllers/auth';
exports.busRouter = express.Router();
/** POST /api/bus */
// busRouter.post('/', controller.create);
exports.busRouter.post('/', controller.create);
