const express = require("express");
const controller = require("../controllers/rules");
// import * as controller from '../controllers/auth';

export const rulesRouter = express.Router();

rulesRouter.post("/", controller.create);
rulesRouter.get("/", controller.show);
rulesRouter.get("/index", controller.index);
rulesRouter.patch("/update", controller.update);
rulesRouter.delete("/destroy", controller.destroy);
