import { NextFunction, Request, Response } from "express";
import { RuleModel, IRuleModel } from "../models/RuleModel";

// create
// get

module.exports.create = async (req: Request, res: Response) => {
  const { algorithmId, parseKeys, rules } = req.body;
  try {
    const job = new RuleModel({ algorithmId, parseKeys, rules });
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(400).send({ message: "Can't save job", error });
  }
};

module.exports.show = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const algorithm = await RuleModel.findOne({ name });
    res.status(200).json(algorithm);
  } catch (error) {
    res.status(400).send({ message: "cant get the algo", error });
  }
};

module.exports.index = async (req: Request, res: Response) => {
  try {
    console.log("hello");
    const algorithms = await RuleModel.find({});
    res.status(200).json(algorithms);
  } catch (error) {
    res.status(400).send({ message: "cant get index", error });
  }
};
