const request = require("supertest");
const { get } = require("../app.js");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const categories = require("../db/data/test-data/categories.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("/api/categories", () => {
  test("GET - 200: responds with an array of category objects, each with the following properties: slug, description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).toBeGreaterThan(3);
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("GET - 404 Invalid path", () => {
    return request(app)
      .get("/api/kategories")
      .expect(404)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Invalid Path");
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET - 200: responds with an array of review objects, ordered by the created_at key", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(categories.length).toBeGreaterThan(3);
        expect(reviews).toBeInstanceOf(Array);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              name: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              count: expect.any(String),
            })
          );
        });
      });
  });
  test("GET: 200 - array of reviews is sorted by created_at column", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET - 404 Invalid path", () => {
    return request(app)
      .get("/api/previews")
      .expect(404)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Invalid Path");
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - 200, responds with a single matching review", () => {
    const reviewId = 3;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          review_body: "We couldn't find the werewolf!",
          designer: "Akihisa Okui",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "social deduction",
          owner: "bainesface",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });
  test("GET: 404 - non existant review_id", () => {
    const reviewId = 655;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID not found");
      });
  });
  test("GET - 400 Id is not a number", () => {
    return request(app)
      .get(`/api/reviews/bananas`)
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Id is not a number");
        });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET - 200, responds with array of comments for given review_id", () => {
    const reviewId = 3;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  test("GET - 404 - non existent review_id", () => {
    const reviewId = 655;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID not found");
      });
  });

  test("GET - 404 Invalid path", () => {
    const reviewId = 2;
    return request(app)
      .get(`/api/previews/${reviewId}/comments`)
      .expect(404)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Invalid path");
        });
      });
  });
  test("GET - 400 Id is not a number", () => {
    return request(app)
      .get(`/api/reviews/bananas/comments`)
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Id is not a number");
        });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("POST - 201 add a new comment to the DB and responds with an object containing the new comment", () => {
    const reviewId = 3;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send({
        userName: "philippaclaire9",
        body: "Hello there!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          author: "philippaclaire9",
          body: "Hello there!",
          votes: expect.any(Number),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });

  test("POST - 404 Invalid path", () => {
    const reviewId = 2;
    return request(app)
      .post(`/api/previews/${reviewId}/comments`)
      .expect(404)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Invalid path");
        });
      });
  });

  test("POST - 400 Id is not a number", () => {
    return request(app)
      .post(`/api/reviews/bananas/comments`)
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Id is not a number");
        });
      });
  });

  test("POST - 404 username not found - Bad Request", () => {
    const reviewId = 3;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send({
        author: "erhnipnopsdnfpnpovjsfpohnwe",
        body: "Hello there!",
        votes: expect.any(Number),
        review_id: expect.any(Number),
        created_at: expect.any(String),
        comment_id: expect.any(Number),
      })
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
      });
  });

  test("POST - body missing - Bad Request", () => {
    const reviewId = 3;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send({
        author: "philippaclaire9",
        votes: expect.any(Number),
        review_id: expect.any(Number),
        created_at: expect.any(String),
        comment_id: expect.any(Number),
      })
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("PATCH - 200 responds with the updated vote", () => {
    const votesUpdate = { votes: 4 };
    return request(app)
      .patch("/api/reviews/3")
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          category: "social deduction",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 9,
        });
      });
  });

  test("PATCH - 404 Invalid path", () => {
    const reviewId = 3;
    return request(app)
      .patch(`/api/previews/${reviewId}`)
      .expect(404)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Invalid path");
        });
      });
  });

  test("PATCH - votes missing - Bad Request", () => {
    const reviewId = 3;
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send({
        review_id: 3,
        title: "Ultimate Werewolf",
        category: "social deduction",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_body: "We couldn't find the werewolf!",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        created_at: "2021-01-18T10:01:41.251Z",
      })
      .expect(400)
      .then((res) => {
        expect((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
      });
  });
});
