const express = require("express");
const { getCategories, getReviews } = require("./controller/controller.js");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

module.exports = app;
