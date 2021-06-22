const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  startingDate: String,
  status: String,
  algorithmId: Number,
  datasetId: Number,
  userId: String,
});

const JobModel = mongoose.model("Job", schema);

module.exports = JobModel;
