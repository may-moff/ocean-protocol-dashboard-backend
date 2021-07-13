const express = require("express");
const controller = require("../controllers/jobs");
// import * as controller from '../controllers/auth';

export const jobsRouter = express.Router({ mergeParams: true });

/** POST /api/jobs */
// jobsRouter.post('/', controller.create);
jobsRouter.post("/", controller.create);
jobsRouter.get("/", controller.show);
jobsRouter.get("/index", controller.index);
