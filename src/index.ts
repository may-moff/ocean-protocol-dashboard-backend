const connection = require("./db-config");
const express = require("express");
import { Request, Response, Application } from "express";
const app: Application = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
import { UserModel } from "./models/user.model";
import { services } from "./services";

const fakeData = [
  { key: 0, title: "Job Number 1", status: "done" },
  { key: 1, title: "Job Number 2", status: "done" },
  { key: 2, title: "Job Number 3", status: "in progres" },
  { key: 3, title: "Job Number 4", status: "done" },
  { key: 4, title: "Job Number 5", status: "done" },
  { key: 5, title: "Job Number 6", status: "in progres" },
  { key: 6, title: "Job Number 7", status: "done" },
  { key: 7, title: "Job Number 8", status: "done" },
  { key: 8, title: "Job Number 9", status: "done" },
];

app.use(cors());
app.use(express.json());
connection();

app.get("/", (req: Request, res: Response) => {
  res.send("Main route working");
});

app.get("/jobs", (req: Request, res: Response) => {
  res.send({ fakeData });
  console.log(res);
});

app.get("/jobs/:id", (req: Request, res: Response) => {
  // res.send(fakeData.filter((key) => key == Request.params.id));
  // console.log(res);
});

// Mount REST on /api
app.use("/api", services);

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
