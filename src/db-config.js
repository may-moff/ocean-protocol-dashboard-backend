// const mongoose = require('mongoose');
require('dotenv').config();

// const connection = async () => {
//   try {
//     await mongoose.connect(process.env.DB_STR, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     });
//     console.log('DB connected');
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = connection;

const mongoose = require('mongoose');
// const dbPath = "mongodb://<dbuser>:<dbpassword>@ds250607.mlab.com:38485/test-db";
const dbPath = process.env.DB_URL;
const connection = () => {
  mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on('error', () => {
    console.log('> error occurred from the database');
  });
  db.once('open', () => {
    console.log('> successfully opened the database');
  });
};
module.exports = connection;
