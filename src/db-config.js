require("dotenv").config();
const mongoose = require("mongoose");
const dbPath = process.env.DB_STR;

const connection = () => {
  mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log(
      "> My dear Maya, it looks like there is a problem with the db, Luca will be available for you 24/7 to help you fix this"
    );
  });
  db.once("open", () => {
    console.log("> My dear Maya, the db is ready for you");
  });
};
module.exports = connection;
