// require('dotenv').config()

// const AWS = require('aws-sdk')
// const ID = process.env.ACCESS_ID
// const SECRET = process.env.SECRET_KEY
// const BUCKET_NAME = 'ocean-dashboard-log'

// const s3 = new AWS.S3({
//   accessKeyId: ID,
//   secretAccessKey: SECRET
// })

// const params = {
//   Bucket: BUCKET_NAME,
//   CreateBucketConfiguration: {
//     // Set your region here
//     LocationConstraint: 'eu-central-1'
//   }
// }

// s3.createBucket(
//   params,
//   function (err: { stack: any }, data: { Location: any }) {
//     if (err) console.log(err, err.stack)
//     else console.log('Bucket Created Successfully', data.Location)
//   }
// )

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

// uploads a file to s3
function uploadFile(file: {
  path: string
  filename: string
  originalname: string
}) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${file.filename}.${file.originalname}`
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

// downloads a file from s3
function getFileStream(fileKey: any) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams)
}
exports.getFileStream = getFileStream
