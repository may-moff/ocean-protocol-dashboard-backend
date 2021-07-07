import { Schema, model } from 'mongoose';

export interface IAlgorithm {
  _id: string;
  name: string;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const algorithmSchema = new Schema<IAlgorithm>({
  name: {
    type: String,
    required: true,
  },
});

export const AlgorithmModel = model<IAlgorithm>('Algorithm', algorithmSchema);
