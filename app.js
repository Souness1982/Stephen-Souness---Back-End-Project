const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewById,
} = require("./controller/controller.js");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Id is not a number" });
});

module.exports = app;
