if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
const port = process.env.PORT || 8000;

const routes = require("./routes");

if (morgan) {
  server.use(morgan("dev"));
}
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(
  cors({
    origin: process.env.CLIENT_URL,
    // optionsSuccessStatus: 200
  })
);

server.use("/api/v1", routes);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
    console.log("Data base connected successfully");
  })
  .catch((error) => console.log(error));
