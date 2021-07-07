import { Schema, model } from "mongoose";

export interface IBus {
  _id: string;
  name: string;
  //   result: array of objects

  // get back on this to verify how to make it work better
  save(): any;
}

const busSchema = new Schema<IBus>({
  name: {
    type: String,
    required: true,
  },
});

export const BusModel = model<IBus>("Bus", busSchema);
