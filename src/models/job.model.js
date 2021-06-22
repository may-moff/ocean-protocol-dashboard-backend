import { Schema, model } from "mongoose";
import { idText } from "typescript";

const jobSchema = new mongoose.Schema({
  startingDate: { type: Date, default: Date.now },
  status: String,
  algorithmId: Number,
  datasetId: Number,
  userId: String,
});
