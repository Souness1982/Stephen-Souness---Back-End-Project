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

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews WHERE review_id = $1;`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review ID not found" });
      }
      return res.rows[0];
    });
};

exports.selectReviewIdComments = (review_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, review_id FROM comments WHERE review_id = $1;`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review ID not found" });
      }

      return res.rows;
    });
};

exports.insertComment = (review_id, comment) => {
  const { userName, body } = comment;
  const queryStr = `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
  // [review_id];
  const queryValues = [review_id, userName, body];

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows[0];
  });
};

exports.patchVotesById = (review_id, body) => {
  console.log(body);
  const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;
  const queryValues = [body.votes, review_id];

  return db.query(queryStr, queryValues).then((updatedVotes) => {
    console.log(updatedVotes.rows[0]);
    return updatedVotes.rows[0];
  });
};
