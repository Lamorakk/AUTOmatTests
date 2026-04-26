import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createMockRestApp } from "../src/mockRestApp.js";

/** @type {import('express').Express} */
let app;
/** @type {() => void} */
let resetStore;

beforeEach(() => {
  const bundle = createMockRestApp();
  app = bundle.app;
  resetStore = bundle.resetStore;
  resetStore();
});

describe("Local REST POST /items — five checks", () => {
  it("creates resource with 201 and body", async () => {
    const response = await request(app).post("/items").send({ title: "Notebook" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, title: "Notebook" });
  });

  it("rejects missing title with 400", async () => {
    const response = await request(app).post("/items").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("title");
  });

  it("rejects blank title with 400", async () => {
    const response = await request(app).post("/items").send({ title: "   " });
    expect(response.status).toBe(400);
  });

  it("assigns incrementing ids for sequential creates", async () => {
    const first = await request(app).post("/items").send({ title: "A" });
    const second = await request(app).post("/items").send({ title: "B" });
    expect(first.body.id).toBe(1);
    expect(second.body.id).toBe(2);
  });

  it("trims surrounding whitespace from title", async () => {
    const response = await request(app).post("/items").send({ title: "  spaced  " });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("spaced");
  });
});
