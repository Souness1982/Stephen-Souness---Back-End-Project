const { selectCategories, selectReviews } = require("../model/model.js");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {});
};

exports.getReviews = (req, res) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {});
};
