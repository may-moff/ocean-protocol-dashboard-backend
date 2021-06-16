import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const userRouter = express.Router();

/** GET /api/users */
userRouter.route('/').get(controller.find);

/** POST /api/users */
userRouter.route('/').post(controller.create);
