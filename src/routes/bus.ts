const express = require("express");
const controller = require("../controllers/bus");
// import * as controller from '../controllers/auth';

export const busRouter = express.Router();

/** POST /api/bus */
// busRouter.post('/', controller.create);
busRouter.post("/", controller.create);
