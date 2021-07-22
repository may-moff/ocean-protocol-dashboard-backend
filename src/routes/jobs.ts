const express = require('express')
const controller = require('../controllers/jobs')
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })

export const jobsRouter = express.Router({ mergeParams: true })

// Authenticated routes
jobsRouter.post('/', upload.single('logBlob'), controller.create)
jobsRouter.get('/', controller.index)
jobsRouter.get('/:jobId', controller.show)
