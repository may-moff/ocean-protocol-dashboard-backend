import { NextFunction, Request, Response } from "express";
import { AlgorithmModel } from "../models/AlgorithmModel";
import { JobModel } from "../models/JobModel";
const fs = require("fs");
const parseFunction = require("../parser.ts");

module.exports.create = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const { algorithmId, dataName } = req.body;

  try {
    if (!req.file) throw "file not available";
    const uploadLocation =
      __dirname + "/../../public/demo/" + req.file.originalname;
    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer))
    );
    const output = parseFunction(uploadLocation, ":", "#");
    const job = new JobModel({
      algorithmId,
      dataName,
      userId,
      filePath: uploadLocation,
      result: output.result,
    });
    await job.save();
    const filter = { _id: algorithmId };
    const update = { parseKeys: output.parseKeys };
    await AlgorithmModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      result: output.result,
      parseKeys: output.parseKeys,
      algorithmId,
      userId,
      dataName,
      filePath: uploadLocation,
    });
  } catch (error) {
    if (error === "file not available")
      res.status(400).send({ message: "Can't access file", error });
    res.status(400).send({ message: "Can't save job", error });
  }
};
