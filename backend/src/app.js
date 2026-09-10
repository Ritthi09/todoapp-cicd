const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // In-memory store (เพื่อการเรียนรู้)
  const todos = new Map();

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.get("/api/todos", (req, res) => {
    res.json(Array.from(todos.values()));
  });

  app.post("/api/todos", (req, res) => {
    const { title } = req.body ?? {};
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }
    const todo = {
      id: uuidv4(),
      title: title.trim(),
      done: false,
      createdAt: new Date().toISOString()
    };
    todos.set(todo.id, todo);
    return res.status(201).json(todo);
  });

  app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const existing = todos.get(id);
    if (!existing) return res.status(404).json({ error: "not found" });

    const { title, done } = req.body ?? {};
    const updated = {
      ...existing,
      title: typeof title === "string" ? title.trim() : existing.title,
      done: typeof done === "boolean" ? done : existing.done
    };
    todos.set(id, updated);
    return res.json(updated);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const ok = todos.delete(id);
    if (!ok) return res.status(404).json({ error: "not found" });
    return res.status(204).send();
  });

  app.use((req, res) => res.status(404).json({ error: "route not found" }));
  return app;
}

module.exports = { createApp };
