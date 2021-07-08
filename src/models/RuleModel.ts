import { Schema, model, ObjectId } from "mongoose";

export interface IRule {
  _id: string;
  algorithm_id: ObjectId;

  parse_keys: Array<string | boolean>;

  rules: Array<string>;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const ruleSchema = new Schema<IRule>({
  algorithm_id: {
    type: Schema.Types.ObjectId,
    ref: "Algorithm",
  },

  parse_keys: [
    {
      key: String,
      data_type: String,
      visualize: Boolean,
    },
  ],
  rules: [
    {
      type: String,
    },
  ],
});

export const RuleModel = model<IRule>("Rule", ruleSchema);
