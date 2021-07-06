import { NextFunction, Request, Response } from "express";
import { AlgorithmModel, IAlgorithm } from "../models/AlgorithmModel";

// create
// get

module.exports.create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const algorithm = new AlgorithmModel({ name });
    await algorithm.save();
    res.status(200).json(algorithm);
  } catch (error) {
    res.status(400).send({ message: "Can't save algorithm", error });
  }
};

module.exports.show = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const algorithm = await AlgorithmModel.findOne({ name });
    res.status(200).json(algorithm);
  } catch (error) {
    res.status(400).send({ message: "cant get the algo", error });
  }
};
