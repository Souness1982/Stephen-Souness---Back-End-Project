const { selectCategories } = require("../model/model.js");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      console.log(categories);
      res.status(200).send({ categories });
    })
    .catch((err) => {});
};
