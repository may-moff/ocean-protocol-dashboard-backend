import { NextFunction, Request, Response } from "express";
import { RuleModel, IRule } from "../models/RuleModel";

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
