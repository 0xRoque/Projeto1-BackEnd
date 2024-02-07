const Joi = require("joi");
const pino = require("pino-http");
const express = require("express");
const app = express();
const root = require("./root/handlers");

app.use(express.json());
app.use(pino());
app.use(root);

app.listen(3000, () => {
  console.log("Server is running (express)");
});
