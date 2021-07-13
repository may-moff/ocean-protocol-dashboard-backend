const express = require("express");
const controller = require("../controllers/jobs");
const multer = require("multer"); //use multer to upload blob data
const upload = multer();
// import * as controller from '../controllers/auth';

export const jobsRouter = express.Router({ mergeParams: true });

/** POST /api/jobs */
// jobsRouter.post('/', controller.create);

jobsRouter.post("/", upload.single("logBlob"), controller.create);
