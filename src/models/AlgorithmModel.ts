import { Schema, model } from "mongoose";

export interface IAlgorithm {
  _id: string;

  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const algorithmSchema = new Schema<IAlgorithm>({});

export const AlgorithmModel = model<IAlgorithm>("Algorithm", algorithmSchema);
