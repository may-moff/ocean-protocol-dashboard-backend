const express = require("express");
const { authRouter } = require("./auth");
const { userRouter } = require("./users");
const { algoRouter } = require("./algo");
const { busRouter } = require("./bus");
const { rulesRouter } = require("./rules");
const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);
routes.use("/algo", algoRouter);
routes.use("/bus", algoRouter);
routes.use("/rules", rulesRouter);
module.exports = routes;
