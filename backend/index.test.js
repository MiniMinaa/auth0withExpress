// backend/index.test.js
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import { createServer } from "node:http";

// Fake auth middleware: blocks when there is no cookie header
const fakeRequiresAuth = (req, res, next) => {
  if (!req.headers.cookie) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  req.oidc = { user: { name: "Ada", email: "ada@test.com" } };
  next();
};

// Small test app — routes used by the integration tests
const app = express();
app.use(express.json());
app.get("/profile", fakeRequiresAuth, (req, res) => {
  res.json(req.oidc.user);
});

// Public books route for testing
app.get("/books", (req, res) => {
  res.json([
    { id: 1, title: "The Hobbit" },
    { id: 2, title: "1984" },
  ]);
});

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

describe("integration: backend routes", () => {
  it("GET /profile without a cookie returns 401", async () => {
    const res = await fetch(`${baseUrl}/profile`);
    expect(res.status).toBe(401);
  });

  it("GET /books without a cookie returns 200", async () => {
    const res = await fetch(`${baseUrl}/books`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
