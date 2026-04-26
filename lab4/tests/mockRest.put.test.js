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

describe("Local REST PUT /items/:id — five checks", () => {
  it("updates title of existing item", async () => {
    await request(app).post("/items").send({ title: "Old" });
    const response = await request(app).put("/items/1").send({ title: "New" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, title: "New" });
  });

  it("returns 404 for unknown id", async () => {
    const response = await request(app).put("/items/99").send({ title: "Ghost" });
    expect(response.status).toBe(404);
  });

  it("returns 400 for invalid id parameter", async () => {
    const response = await request(app).put("/items/not-a-number").send({ title: "X" });
    expect(response.status).toBe(400);
  });

  it("keeps previous title when body omits title field", async () => {
    await request(app).post("/items").send({ title: "Stable" });
    const response = await request(app).put("/items/1").send({});
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Stable");
  });

  it("allows unicode titles after update", async () => {
    await request(app).post("/items").send({ title: "A" });
    const response = await request(app).put("/items/1").send({ title: "Київ" });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Київ");
  });
});
