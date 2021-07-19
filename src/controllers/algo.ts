import { Request, Response } from 'express'
import { AlgorithmModel } from '../models/AlgorithmModel'
import { JobModel } from '../models/JobModel'
import { UserModel } from '../models/UserModel'
const parseFunction = require('../parser')
const fs = require('fs')
const path = require('path')
// eslint-disable-next-line security/detect-non-literal-fs-filename
const unlinkFile = require('util').promisify(fs.unlink)
const { getFileStream } = require('../aws-config')

interface ParseKeys {
  key: string
  dataType: string
  visualize: boolean
  value?: string | number
}

module.exports.create = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { algoName } = req.body

  try {
    const currentUser = await UserModel.findOne({ publicAddress: userId })
    if (!currentUser) throw new Error('user not found')
    const findAlgo = await AlgorithmModel.findOne({ algoName })
    if (findAlgo) res.status(200).json(findAlgo)
    const algorithm = new AlgorithmModel({ algoName, userId: currentUser._id })
    await algorithm.save()
    res.status(200).json(algorithm)
  } catch (error) {
    if (error === 'user not found') {
      res.status(400).send({ message: 'Invalid user', error })
    }

    res.status(400).send({ message: "Can't save algorithm", error })
  }
}

module.exports.show = async (req: Request, res: Response, data: any) => {
  const { algoName } = req.body
  try {
    const algorithm = await AlgorithmModel.findOne({ algoName })
    res.status(200).json(algorithm)
  } catch (error) {
    res.status(400).send({ message: 'cant get the algo', error })
  }
}

module.exports.index = async (req: Request, res: Response) => {
  try {
    console.log('hello')
    const algorithms = await AlgorithmModel.find({})
    res.status(200).json(algorithms)
  } catch (error) {
    res.status(400).send({ message: 'cant get all algos', error })
  }
}

module.exports.update = async (req: Request, res: Response) => {
  const algorithmId: string = req.params.algoId
  const fileName = path.basename(req.body.filePath)
  const localFilePath = `public/uploads/${fileName}`

  try {
    await getFileStream(fileName)

    const rules = req.body.parseKeys
      .map((e: ParseKeys) =>
        req.body.defaultKeys.includes(e.key) ? null : e.key
      )
      .filter((e: string) => e !== null)

    const output = await parseFunction(localFilePath, ':', '#', rules)
    const jobFilter = { _id: req.body.jobId }
    const jobUpdate = { result: output.result }
    await JobModel.findByIdAndUpdate(jobFilter, jobUpdate)

    const updatedParseKeys = output.parseKeys.map((e: ParseKeys) => {
      const currentElement = req.body.parseKeys.find(
        (x: ParseKeys) => x.key === e.key
      )
      return currentElement ? { ...e, visualize: currentElement.visualize } : e
    })
    const displayContent = updatedParseKeys.map((e: ParseKeys) => ({
      ...e,
      value: output.result[e.key]
    }))

    const filter = { _id: algorithmId }
    const update = { parseKeys: updatedParseKeys, rules }
    await AlgorithmModel.findOneAndUpdate(filter, update)

    await unlinkFile(localFilePath)

    res.status(200).json({
      ...req.body,
      result: output.result,
      parseKeys: displayContent,
      rules
    })
  } catch (error) {
    res.status(400).send({ message: 'no no no' })
  }

  // const algorithmId: string = req.params.algoId

  // try {
  //   const rules = req.body.parseKeys
  //     .map((e: ParseKeys) =>
  //       req.body.defaultKeys.includes(e.key) ? null : e.key
  //     )
  //     .filter((e: string) => e !== null)
  //   const output = await parseFunction(req.body.filePath, ':', '#', rules)
  //   const jobFilter = { _id: req.body.jobId }
  //   const jobUpdate = { result: output.result }
  //   await JobModel.findByIdAndUpdate(jobFilter, jobUpdate)

  //   const updatedParseKeys = output.parseKeys.map((e: ParseKeys) => {
  //     const currentElement = req.body.parseKeys.find(
  //       (x: ParseKeys) => x.key === e.key
  //     )
  //     return currentElement ? { ...e, visualize: currentElement.visualize } : e
  //   })
  //   const displayContent = updatedParseKeys.map((e: ParseKeys) => ({
  //     ...e,
  //     value: output.result[e.key]
  //   }))

  //   const filter = { _id: algorithmId }
  //   const update = { parseKeys: updatedParseKeys, rules }
  //   await AlgorithmModel.findOneAndUpdate(filter, update)

  //   await unlinkFile()

  //   res.status(200).json({
  //     ...req.body,
  //     result: output.result,
  //     parseKeys: displayContent,
  //     rules
  //   })
  // } catch (error) {
  //   res.status(400).send({ message: 'no no no' })
  // }
}
