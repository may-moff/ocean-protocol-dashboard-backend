import { NextFunction, Request, Response } from "express";
import { AlgorithmModel, IAlgorithm } from "../models/AlgorithmModel";
import { JobModel } from "../models/JobModel";
import { UserModel } from "../models/UserModel";
const parseFunction = require("../parser.ts");

// create
// get

module.exports.create = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const { name } = req.body;

  try {
    const currentUser = await UserModel.findOne({ publicAddress: userId });
    if (!currentUser) throw "user not found";
    const findAlgo = await AlgorithmModel.findOne({ name });
    if (findAlgo) res.status(200).json(findAlgo);
    const algorithm = new AlgorithmModel({ name, userId: currentUser._id });
    await algorithm.save();
    res.status(200).json(algorithm);
  } catch (error) {
    if (error === "user not found") {
      res.status(400).send({ message: "Invalid user", error });
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
    res.status(400).send({ message: "cant get the algo", error });
  }
};

module.exports.index = async (req: Request, res: Response) => {
  try {
    console.log("hello");
    const algorithms = await AlgorithmModel.find({});
    res.status(200).json(algorithms);
  } catch (error) {
    res.status(400).send({ message: "cant get all algos", error });
  }
};

module.exports.update = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const algorithmId: string = req.params.algoId;

  try {
    const filter = { _id: algorithmId };
    const update = { parseKeys: req.body.parseKeys, rule: req.body.rule };
    await AlgorithmModel.findOneAndUpdate(filter, update);
    const output = await parseFunction(
      req.body.filePath,
      ":",
      "#",
      req.body.rule
    );
    const jobFilter = { _id: req.body._id };
    const jobUpdate = { result: output.result };
    await JobModel.findByIdAndUpdate(jobFilter, jobUpdate);
    res.status(200).json({
      result: output.result,
      parseKeys: output.parseKeys,
    });
  } catch (error) {
    res.status(400).send({ message: "no no no" });
  }
};
