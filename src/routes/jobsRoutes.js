const express = require("express");
const router = express.Router();

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

router.get("/jobs/:id", (req, res) => {
  // res.send(fakeData.filter((key) => key == req.id));
  // console.log(res);
});

router.get("/jobs", (req, res) => {
  res.send({ fakeData });
  console.log(res);
});

module.exports = router;
