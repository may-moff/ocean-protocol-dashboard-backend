const connection = require("./db-config");
const express = require("express");
import { Request, Response, Application } from "express";
const app: Application = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
import { UserModel } from "./models/UserModel";
const routes = require("./routes");

app.use(cors());
app.use(express.json());
connection();
app.get("/", (req: Request, res: Response) => {
  res.send("Main route working");
});

// Mount REST on /api
app.use("/api", routes);

app.post("/test", async (req: Request, res: Response) => {
  const { publicAddress } = req.body;
  try {
    const newUser = new UserModel({ publicAddress });
    await newUser.save();
    res.send("User saved");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
