const express = require("express");
const routes = express();
const authRouter = require("./auth");
const userRouter = require("./user");

routes.use("/account", authRouter);
routes.use("/user", userRouter);

module.exports = routes;
