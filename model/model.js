const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT name, reviews.review_id, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) FROM reviews
      JOIN users
      ON reviews.owner = users.username
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id 
      GROUP BY users.name, reviews.review_id
      ORDER BY created_at DESC;`
    )
    .then((res) => {
      return res.rows;
    });
};
