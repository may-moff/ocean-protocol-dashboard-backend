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
  user_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  result: {
    type: String,
  },
});

export const JobModel = model<IJob>("Job", jobSchema);
