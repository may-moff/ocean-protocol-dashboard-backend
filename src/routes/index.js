const express = require('express');
const { authRouter } = require('./auth');
const { userRouter } = require('./users');
const { algoRouter } = require('./algo');

const routes = express.Router();

const fs = require('fs');
const multer = require('multer'); //use multer to upload blob data
const upload = multer();
const parseFunction = require('../parser');

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/algo', algoRouter);
routes.use('/test/upload', upload.single('logBlob'), (req, res) => {
  let uploadLocation =
    __dirname + '/../../public/demo/' + req.file.originalname; // where to save the file to. make sure the incoming name has a .webm extension
  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  ); // write the blob to the server as a file
  const output = parseFunction(uploadLocation, ':', '#');
  res.status(200).json(output);
});

module.exports = routes;
