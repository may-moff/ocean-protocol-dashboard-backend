import { Schema, model, Mongoose, ObjectId } from "mongoose";

export interface IRule {
  _id: string;
  parse_keys: string;
  rules: string;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const ruleSchema = new Schema<IRule>({
  parse_keys: {
    key: String,
    type: String,
    visualize: Boolean,
  },
  rules: {
    type: String,
  },
});

export const RuleModel = model<IRule>("Rule", ruleSchema);
