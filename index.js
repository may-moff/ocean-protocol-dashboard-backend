const connection = require('./db-config');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// import usersRoute from './routes/usersRoute.js';
// import connectDB from "./db.js";
app.use(cors());
app.use(express.json());
connection();
app.get('/', (req, res) => {
  res.send('Main route working');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
