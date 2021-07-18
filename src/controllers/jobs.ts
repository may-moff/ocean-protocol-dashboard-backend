import { Request, Response } from 'express'
// import path from 'path'
import { AlgorithmModel } from '../models/AlgorithmModel'
import { JobModel } from '../models/JobModel'
// const fs = require('fs')
const { uploadFile } = require('../aws-config')
const parseFunction = require('../parser')
// eslint-disable-next-line security/detect-non-literal-fs-filename
// const unlinkFile = require('util').promisify(fs.unlink)

interface ParseKeys {
  key: string
  dataType: string
  visualize: boolean
}

module.exports.create = async (req: Request, res: Response) => {
  const { file } = req
  const { userId } = req.params
  const { algorithmId, dataName } = req.body
  // console.log('Fle', file)

  try {
    if (!file) throw new Error('file not available')

    const result = await uploadFile(file)
    console.log('Result:', result)

    const output = parseFunction(file.path, ':', '#')
    const job = new JobModel({
      algorithmId,
      dataName,
      userId,
      filePath: result.Location,
      result: output.result
    })
    await job.save()
    const filter = { _id: algorithmId }
    const update = { parseKeys: output.parseKeys }
    await AlgorithmModel.findOneAndUpdate(filter, update)

    const displayContent = output.parseKeys.map((e: ParseKeys) => ({
      ...e,
      value: output.result[e.key]
    }))
    const defaultKeys = output.parseKeys.map((e: ParseKeys) => e.key)

    // await unlinkFile(file.path)

    res.status(200).json({
      jobId: job._id,
      result: output.result,
      parseKeys: displayContent,
      defaultKeys,
      algorithmId,
      userId,
      dataName,
      rules: [],
      filePath: job.filePath,
      key: result.key
    })
  } catch (error) {
    if (error === 'file not available')
      res.status(400).send({ message: "Can't access file", error })
    res.status(400).send({ message: "Can't save job", error })
  }

  // const { userId } = req.params
  // const { algorithmId, dataName } = req.body

  // try {
  //   if (!req.file) throw new Error('file not available')
  //   const uploadLocation = path.join(
  //     __dirname,
  //     '/../../public/demo/',
  //     req.file.originalname
  //   )
  //   // eslint-disable-next-line security/detect-non-literal-fs-filename
  //   fs.writeFileSync(
  //     uploadLocation,
  //     Buffer.from(new Uint8Array(req.file.buffer))
  //   )
  //   const output = parseFunction(uploadLocation, ':', '#')
  //   const job = new JobModel({
  //     algorithmId,
  //     dataName,
  //     userId,
  //     filePath: uploadLocation,
  //     result: output.result
  //   })
  //   await job.save()
  //   const filter = { _id: algorithmId }
  //   const update = { parseKeys: output.parseKeys }
  //   await AlgorithmModel.findOneAndUpdate(filter, update)

  //   const displayContent = output.parseKeys.map((e: ParseKeys) => ({
  //     ...e,
  //     value: output.result[e.key]
  //   }))
  //   const defaultKeys = output.parseKeys.map((e: ParseKeys) => e.key)

  //   res.status(200).json({
  //     jobId: job._id,
  //     result: output.result,
  //     parseKeys: displayContent,
  //     defaultKeys,
  //     algorithmId,
  //     userId,
  //     dataName,
  //     rules: [],
  //     filePath: uploadLocation
  //   })
  // } catch (error) {
  //   if (error === 'file not available')
  //     res.status(400).send({ message: "Can't access file", error })
  //   res.status(400).send({ message: "Can't save job", error })
  // }
}
