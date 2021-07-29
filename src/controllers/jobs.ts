import { Request, Response } from 'express'
import { AlgorithmModel } from '../models/AlgorithmModel'
import { JobModel, IJob } from '../models/JobModel'
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
  value?: string | number
}

interface IJobWithValues extends IJob {
  parseKeys?: {
    key: string
    dataType: string
    visualize: boolean
    value: string | number
  }[]
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
    if (error === 'File not available')
      res.status(400).send({ message: "Can't access file", error })
    res.status(400).send({ message: "Can't save job", error })
  }
}

module.exports.index = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
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
  const { jobId, userId } = req.params
  try {
    const currentJob: any = await JobModel.findById(jobId).populate(
      'algorithmId',
      'algoName'
    )
    if (!currentJob) throw new Error('Job not found')
    const algorithmId = currentJob.algorithmId._id
    const currentAlgorithm = await AlgorithmModel.findById(algorithmId)
    if (!currentAlgorithm) throw new Error('Algorithm not found')

    const currentParseKeysWithValue = currentAlgorithm.parseKeys.map(
      (e: any) => {
        return { ...e._doc, value: currentJob.result[e.key] }
      }
    )

    const allJobs = (
      await JobModel.find({
        algorithmId: mongoose.Types.ObjectId(algorithmId),
        userId: mongoose.Types.ObjectId(userId)
      })
    ).filter((e: any) => e._id.toString() !== jobId)

    const allJobsOutput = allJobs.map((e: any) => {
      const parseKeys = currentAlgorithm.parseKeys.map((x: any) => {
        return { ...x._doc, value: e.result[x.key] }
      })
      return { ...e._doc, parseKeys }
    })

    delete currentJob._doc.result
    allJobsOutput.forEach((e: any) => delete e.result)

    res.status(200).json({
      currentJob: { ...currentJob._doc, parseKeys: currentParseKeysWithValue },
      otherJobs: allJobsOutput
    })
  } catch (error) {
    res.status(400).send({ message: "Can't show jobs", error })
  }
}
