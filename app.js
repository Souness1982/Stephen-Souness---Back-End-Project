const express = require("express");
const { getCategories } = require("./controller/controller.js");
const app = express();

app.get("/api/categories", getCategories);

module.exports = app;
