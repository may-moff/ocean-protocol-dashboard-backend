require("dotenv").config();

const mongoose = require("mongoose");

// path to use local mondodb instance
const dbPath = process.env.DB_STR;
// path to use Atlas cluster
// const dbPath = process.env.DB_STR;
const connection = () => {
  mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("> error occurred from the database");
  });
  db.once("open", () => {
    console.log("> successfully opened the database");
  });
};
module.exports = connection;
