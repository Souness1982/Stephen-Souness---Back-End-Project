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
