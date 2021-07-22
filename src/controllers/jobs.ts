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
      algorithmId,
      dataName,
      defaultKeys,
      date: job.date,
      filePath: job.filePath,
      jobId: job._id,
      jobName,
      parseKeys: displayContent,
      removedItemsHistory: [],
      result: output.result,
      rules: [],
      userId
    })
  } catch (error) {
    if (error === 'file not available')
      res.status(400).send({ message: "Can't access file", error })
    res.status(400).send({ message: "Can't save job", error })
  }
}

module.exports.index = async (req: Request, res: Response) => {
  const { userId } = req.params
  console.log('im listing sll jobs')
  try {
    // find all jobs where publicaddress.userid is the same as jobs.userId

    const jobs = await JobModel.find({
      userId: mongoose.Types.ObjectId(userId)
    }).populate('algorithmId', 'algoName')

    if (!jobs) throw new Error('There are no jobs associated with this user')

    res.status(200).json(jobs)
  } catch (error) {
    res.status(400).send({
      message: 'Cannot get the jobs for this user',
      error
    })
  }
}

module.exports.show = async (req: Request, res: Response) => {
  console.log('i am showing one job')
  const { jobId, userId } = req.params
  try {
    const job = await JobModel.findById(jobId)
    if (!job) throw new Error('Job not found')
    // const algorithmId = job.algorithmId
    const { algorithmId } = job
    const allJobs = await JobModel.find({
      algorithmId: mongoose.Types.ObjectId(algorithmId),
      userId: mongoose.Types.ObjectId(userId)
    }).populate('algorithmId', 'algoName')
    console.log(allJobs)

    res.status(200).json(allJobs)
  } catch (error) {
    res.status(400).send({ message: 'Cannot get jobs', error })
  }
}
