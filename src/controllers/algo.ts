import { NextFunction, Request, Response } from 'express';
import { AlgorithmModel, IAlgorithm } from '../models/AlgorithmModel';
import { JobModel } from '../models/JobModel';
import { UserModel } from '../models/UserModel';
const parseFunction = require('../parser.ts');

interface ParseKeys {
  key: string;
  dataType: string;
  visualize: boolean;
}

interface ParseKeysValues {
  key: string;
  dataType: string;
  visualize: boolean;
  value: string | number;
}

module.exports.create = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const { name } = req.body;

  try {
    const currentUser = await UserModel.findOne({ publicAddress: userId });
    if (!currentUser) throw 'user not found';
    const findAlgo = await AlgorithmModel.findOne({ name });
    if (findAlgo) res.status(200).json(findAlgo);
    const algorithm = new AlgorithmModel({ name, userId: currentUser._id });
    await algorithm.save();
    res.status(200).json(algorithm);
  } catch (error) {
    if (error === 'user not found') {
      res.status(400).send({ message: 'Invalid user', error });
    }

    res.status(400).send({ message: "Can't save algorithm", error });
  }
};

module.exports.show = async (req: Request, res: Response, data: any) => {
  const { name } = req.body;
  try {
    const algorithm = await AlgorithmModel.findOne({ name });
    res.status(200).json(algorithm);
  } catch (error) {
    res.status(400).send({ message: 'cant get the algo', error });
  }
};

module.exports.index = async (req: Request, res: Response) => {
  try {
    console.log('hello');
    const algorithms = await AlgorithmModel.find({});
    res.status(200).json(algorithms);
  } catch (error) {
    res.status(400).send({ message: 'cant get all algos', error });
  }
};

module.exports.update = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const algorithmId: string = req.params.algoId;

  try {
    const rules = req.body.parseKeys
      .map((e: ParseKeys) =>
        req.body.defaultKeys.includes(e.key) ? null : e.key
      )
      .filter((e: string) => e !== null);
    const output = await parseFunction(req.body.filePath, ':', '#', rules);
    const jobFilter = { _id: req.body.jobId };
    const jobUpdate = { result: output.result };
    await JobModel.findByIdAndUpdate(jobFilter, jobUpdate);

    const updatedParseKeys = output.parseKeys.map((e: ParseKeys) => {
      const currentElement = req.body.parseKeys.find(
        (x: ParseKeysValues) => x.key === e.key
      );
      return currentElement ? { ...e, visualize: currentElement.visualize } : e;
    });
    const displayContent = updatedParseKeys.map((e: ParseKeys) => ({
      ...e,
      value: output.result[e.key],
    }));

    const filter = { _id: algorithmId };
    const update = { parseKeys: updatedParseKeys, rules };
    await AlgorithmModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      ...req.body,
      result: output.result,
      parseKeys: displayContent,
      rules,
    });
  } catch (error) {
    res.status(400).send({ message: 'no no no' });
  }
};
