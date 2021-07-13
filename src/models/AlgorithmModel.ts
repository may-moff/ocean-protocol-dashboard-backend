import { Schema, model, ObjectId } from "mongoose";

export interface IAlgorithm {
  _id: string;
  name: string;
  userId: ObjectId;
  parseKeys: Array<string | boolean>;
  rules: Array<string | boolean>;
  //   result: array of objects
  // get back on this to verify how to make it work better
  save(): any;
}

const algorithmSchema = new Schema<IAlgorithm>({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  parseKeys: [
    {
      key: String,
      dataType: String,
      visualize: Boolean,
    },
  ],
  rules: [
    {
      type: [Schema.Types.Mixed],
    },
  ],
});

export const AlgorithmModel = model<IAlgorithm>("Algorithm", algorithmSchema);
