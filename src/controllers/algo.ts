import { NextFunction, Request, Response } from "express";
import { AlgorithmModel, IAlgorithm } from "../models/AlgorithmModel";

// create
// get

module.exports.create = async (req: Request, res: Response) => {
  const { name, parseKeys, rules } = req.body;
  try {
    const algorithm = new AlgorithmModel({ name, parseKeys, rules });
    await algorithm.save();
    res.status(200).json(algorithm);
  } catch (error) {
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
    res.status(400).send({ message: "cant get algo index", error });
  }
};
