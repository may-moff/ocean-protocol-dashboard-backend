const express = require('express');
const controller = require('../controllers/auth');
// import * as controller from '../controllers/auth';

export const authRouter = express.Router();

/** POST /api/auth */
// authRouter.post('/', controller.create);
authRouter.post('/', controller.create);
