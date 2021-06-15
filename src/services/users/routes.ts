import express from "express";
// import jwt from "express-jwt";
const jwt = require("jsonwebtoken");

import { config } from "../../config";

import * from "./controller";

export const userRouter = express.Router();

/** GET /api/users */
userRouter.route("/").get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").get(jwt(config), controller.get);

/** POST /api/users */
userRouter.route("/").post(controller.create);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").patch(jwt(config), controller.patch);
