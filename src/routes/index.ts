const express = require('express');
const { authRouter } = require('./auth');
const { userRouter } = require('./users');

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);

module.exports = routes;
