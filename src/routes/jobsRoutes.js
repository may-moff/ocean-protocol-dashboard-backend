const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

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

router.post("/", jobsController.create);

router.get("/", jobsController.show);

router.get("/:id", jobsController.index);

router.put("/:id", jobsController.update);

router.delete("/:id", jobsController.destroy);

module.exports = router;
