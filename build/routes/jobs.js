"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsRouter = void 0;
const express = require('express');
const controller = require('../controllers/jobs');
const multer = require('multer');
const upload = multer();
// import * as controller from '../controllers/auth';
exports.jobsRouter = express.Router({ mergeParams: true });
/** POST /api/jobs */
// jobsRouter.post('/', controller.create);
exports.jobsRouter.post('/', upload.single('logBlob'), controller.create);
