require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

function uploadFile(file: {
  path: string
  filename: string
  originalname: string
}) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${file.filename}.${file.originalname}`
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

async function getFileStream(fileKey: any) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const file = require('fs').createWriteStream(`public/uploads/${fileKey}`)

  // eslint-disable-next-line no-new
  return new Promise((resolve, reject) => {
    const pipe = s3.getObject(downloadParams).createReadStream().pipe(file)
    pipe.on('error', reject)
    pipe.on('close', resolve)
  })
}

exports.getFileStream = getFileStream
