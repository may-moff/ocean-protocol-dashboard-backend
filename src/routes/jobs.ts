const express = require('express')
const controller = require('../controllers/jobs')
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const authenticateToken = require('../middlewares/authenticateToken')

export const jobsRouter = express.Router({ mergeParams: true })

jobsRouter.post(
  '/',
  authenticateToken,
  upload.single('logBlob'),
  controller.create
)
jobsRouter.get('/', controller.index)
jobsRouter.get('/:jobId', controller.show)
