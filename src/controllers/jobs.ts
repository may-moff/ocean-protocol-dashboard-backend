import { Request, Response } from 'express'

import { AlgorithmModel } from '../models/AlgorithmModel'
import { JobModel } from '../models/JobModel'
const fs = require('fs')
const { uploadFile } = require('../aws-config')
const parseFunction = require('../parser')
const mongoose = require('mongoose')
// eslint-disable-next-line security/detect-non-literal-fs-filename
const unlinkFile = require('util').promisify(fs.unlink)

interface ParseKeys {
  key: string
  dataType: string
  visualize: boolean
}

module.exports.create = async (req: Request, res: Response) => {
  const { file } = req
  const { userId } = req.params
  const { algorithmId, dataName, jobName } = req.body

  try {
    if (!file) throw new Error('file not available')

    const result = await uploadFile(file)

    const output = parseFunction(file.path, ':', '#')
    const job = new JobModel({
      jobName,
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

    await unlinkFile(file.path)

    res.status(200).json({
      jobId: job._id,
      result: output.result,
      parseKeys: displayContent,
      defaultKeys,
      jobName,
      algorithmId,
      userId,
      dataName,
      rules: [],
      filePath: job.filePath
    })
  } catch (error) {
    if (error === 'file not available')
      res.status(400).send({ message: "Can't access file", error })
    res.status(400).send({ message: "Can't save job", error })
  }
}

module.exports.index = async (req: Request, res: Response) => {
  try {
    console.log('whatup')
    const jobs = await JobModel.find({})
    res.status(200).json(jobs)
    console.log(jobs)
  } catch (error) {
    res.status(400).send({
      message: 'cannot get all jobs',
      error
    })
  }
}

module.exports.show = async (req: Request, res: Response) => {
  const { jobId, userId } = req.params
  try {
    const job = await JobModel.findById(jobId)
    if (!job) throw new Error('Job not found')
    // const algorithmId = job.algorithmId
    const { algorithmId } = job
    const allJobs = await JobModel.find({
      algorithmId: mongoose.Types.ObjectId(algorithmId),
      userId: mongoose.Types.ObjectId(userId)
    })
    res.status(200).json(allJobs)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'Cannot get jobs', error })
  }
}
