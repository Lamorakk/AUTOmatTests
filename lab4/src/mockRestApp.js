import express from "express";

/**
 * In-memory REST API for lab POST / PUT / DELETE checks (OpenWeatherMap has no public CRUD).
 *
 * @returns {{ app: import('express').Express, resetStore: () => void }}
 */
export function createMockRestApp() {
  try {
    /** @type {{ id: number; title: string }[]} */
    let items = [];
    let nextId = 1;

    const app = express();
    app.use(express.json());

    app.get("/items", (_req, res) => {
      try {
        res.json(items);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
      }
    });

    app.get("/items/:id", (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
          res.status(400).json({ error: "Invalid id" });
          return;
        }
        const item = items.find((entry) => entry.id === id);
        if (!item) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        res.json(item);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
      }
    });

    app.post("/items", (req, res) => {
      try {
        const { title } = req.body ?? {};
        if (typeof title !== "string" || title.trim().length === 0) {
          res.status(400).json({ error: "Field `title` (non-empty string) is required" });
          return;
        }
        const item = { id: nextId, title: title.trim() };
        nextId += 1;
        items.push(item);
        res.status(201).json(item);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
      }
    });

    app.put("/items/:id", (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
          res.status(400).json({ error: "Invalid id" });
          return;
        }
        const item = items.find((entry) => entry.id === id);
        if (!item) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        const { title } = req.body ?? {};
        if (typeof title === "string") {
          item.title = title;
        }
        res.json(item);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
      }
    });

    app.delete("/items/:id", (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
          res.status(400).json({ error: "Invalid id" });
          return;
        }
        const index = items.findIndex((entry) => entry.id === id);
        if (index === -1) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        items.splice(index, 1);
        res.status(204).send();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
      }
    });

    const resetStore = () => {
      items = [];
      nextId = 1;
    };

    return { app, resetStore };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`createMockRestApp failed: ${message}`);
  }
}
