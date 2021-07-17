const express = require('express')
const controller = require('../controllers/jobs')
const multer = require('multer')
// const upload = multer()
const upload = multer({ dest: 'uploads/' })

export const jobsRouter = express.Router({ mergeParams: true })

/** POST /api/jobs */
// jobsRouter.post('/', controller.create);

jobsRouter.post('/', upload.single('logBlob'), controller.create)
