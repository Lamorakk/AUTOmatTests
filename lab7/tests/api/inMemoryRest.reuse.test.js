/**
 * API / integration — reuses Express app factory from lab4. Minimum five checks (supertest).
 */
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createMockRestApp } from "../../../lab4/src/mockRestApp.js";

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

describe("Lab4 in-memory REST /items (lab7 unified suite)", () => {
  it("GET /items returns empty array initially", async () => {
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /items creates resource with 201", async () => {
    const res = await request(app).post("/items").send({ title: "Alpha" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: "Alpha" });
  });

  it("GET /items/:id returns one record", async () => {
    await request(app).post("/items").send({ title: "Beta" });
    const res = await request(app).get("/items/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: "Beta" });
  });

  it("PUT /items/:id updates title", async () => {
    await request(app).post("/items").send({ title: "Old" });
    const res = await request(app).put("/items/1").send({ title: "New" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New");
  });

  it("DELETE /items/:id removes resource", async () => {
    await request(app).post("/items").send({ title: "X" });
    const del = await request(app).delete("/items/1");
    expect(del.status).toBe(204);
    const list = await request(app).get("/items");
    expect(list.body).toEqual([]);
  });

  it("POST /items rejects empty title with 400", async () => {
    const res = await request(app).post("/items").send({ title: "   " });
    expect(res.status).toBe(400);
  });
});
