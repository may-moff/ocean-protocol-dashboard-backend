const express = require('express');
const { authRouter } = require('./auth');
const { userRouter } = require('./users');
const { algoRouter } = require('./algo');

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/algo', algoRouter);

module.exports = routes;
