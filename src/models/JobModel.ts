import { Schema, model, Mongoose, ObjectId } from "mongoose";

export interface IJob {
  _id: string;
  algo_id: number;
  data_id: number;
  user_id: ObjectId;
  result: string;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const jobSchema = new Schema<IJob>({
  algo_id: {
    type: Number,
    default: () => Math.floor(Math.random() * 100),
    required: true,
  },
  data_id: {
    type: Number,
    default: () => Math.floor(Math.random() * 100),
    required: true,
  },
  // correct way of referencing user_id?
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // does it work like this to get an array of strings??
  result: {
    type: [String],
  },
});

export const JobModel = model<IJob>("Job", jobSchema);
