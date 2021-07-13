import { Schema, model, ObjectId } from "mongoose";

export interface IJob {
  _id: string;
  algorithm_id: ObjectId;
  data_id: number;
  user_id: ObjectId;
  filePath: string;
  result: { [x: string]: string | number };

  // get back on this to verify how to make it work better
  save(): any;
}

const jobSchema = new Schema<IJob>({
  algorithmId: {
    type: Schema.Types.ObjectId,
    ref: "Algorithm",
  },
  dataId: {
    type: Number,
    default: () => Math.floor(Math.random() * 100),
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  filePath: {
    type: String,
  },

  result: {
    type: [Schema.Types.Mixed],
  },
});

export const JobModel = model<IJob>("Job", jobSchema);
