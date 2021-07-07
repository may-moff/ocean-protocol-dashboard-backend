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
  algorithmId: {
    type: Schema.Types.ObjectId,
    ref: "Algorithm",
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
      type: String,
    },
  ],
});

export const RuleModel = model<IRule>("Rule", ruleSchema);
