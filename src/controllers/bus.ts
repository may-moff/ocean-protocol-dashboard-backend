import { NextFunction, Request, Response } from "express";
import { BusModel, IBus } from "../models/BusModel";

module.exports.create = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const bus = new BusModel({ name });
    await bus.save();
    res.status(200).json(bus);
  } catch (error) {
    res.status(400).send({ message: "Can't save Bus", error });
  }
};
