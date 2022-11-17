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

  test("GET - 400 Bad Request when Id is not a number", () => {
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
