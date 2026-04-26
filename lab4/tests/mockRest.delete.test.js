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

describe("Local REST DELETE /items/:id — five checks", () => {
  it("returns 204 and removes item", async () => {
    await request(app).post("/items").send({ title: "Temp" });
    const response = await request(app).delete("/items/1");
    expect(response.status).toBe(204);
    const list = await request(app).get("/items");
    expect(list.body).toEqual([]);
  });

  it("returns 404 when deleting twice", async () => {
    await request(app).post("/items").send({ title: "Once" });
    await request(app).delete("/items/1");
    const second = await request(app).delete("/items/1");
    expect(second.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const response = await request(app).delete("/items/abc");
    expect(response.status).toBe(400);
  });

  it("deletes only targeted id among several", async () => {
    await request(app).post("/items").send({ title: "One" });
    await request(app).post("/items").send({ title: "Two" });
    await request(app).delete("/items/1");
    const list = await request(app).get("/items");
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(2);
  });

  it("returns 404 for never-created id", async () => {
    const response = await request(app).delete("/items/42");
    expect(response.status).toBe(404);
  });
});
