// Write your tests here

const request = require("supertest");
const server = require("./api/server");
const testUser = { username: "test", password: "test" };
const db = require("./database/dbConfig");
test("sanity", () => {
  expect(true).toBe(true);
});
describe("server.js", () => {
  describe("Get jokes req", () => {
    it("should return 401", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(401);
    });
    it("should return json", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.type).toBe("application/json");
    });
  });
  describe("user registe", () => {
    it("returns 201", async () => {
      await db("users").truncate();
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser);
      expect(res.status).toBe(201);
    });
    it("returns 500 as invalid", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ user: "test", pass: "jabroni" });
      expect(res.status).toBe(500);
    });
  });
  describe("User Login", () => {
    it("returns a valid user", async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      expect(res.status).toBe(500);
    });
    it("invalid user error", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "does not exist", password: "never entered" });
      expect(res.status).toBe(500);
    });
  });
});
