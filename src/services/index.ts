import express from 'express';

import { userRouter } from './users';

export const services = express.Router();

services.use('/users', userRouter);
