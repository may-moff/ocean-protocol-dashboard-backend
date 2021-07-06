import { Schema, model, Mongoose, ObjectId } from "mongoose";

export interface IRule {
  _id: string;
  algo_id: string;
  //   ??
  parse_keys: string;
  //   ??
  rules: string;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const ruleSchema = new Schema<IRule>({
  // algo_id: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  //   can we get the algo_id from user collection like this?
  algo_id: { type: String },
  //   or should it be [Schema.Types.Mixed] ??
  parse_keys: {
    key: String,
    data_type: String,
    visualize: Boolean,
  },
  rules: {
    type: [String],
  },
});

export const RuleModel = model<IRule>("Rule", ruleSchema);
