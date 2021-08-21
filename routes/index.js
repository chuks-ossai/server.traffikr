const express = require("express");
const routes = express();
const authRouter = require("./auth");
const userRouter = require("./user");
const categoryRouter = require("./category");

routes.use("/account", authRouter);
routes.use("/user", userRouter);
routes.use("/category", categoryRouter);

module.exports = routes;
