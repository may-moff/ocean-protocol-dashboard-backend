const express = require("express");
const router = express.Router();

const jobsRoutes = require("./jobsRoutes");

router.use("/jobs", jobsRoutes);

module.exports = router;
