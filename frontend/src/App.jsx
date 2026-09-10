import React, { useEffect, useState } from "react";
import { addTodo, deleteTodo, listTodos, updateTodo } from "./api.js";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setError("");
      const data = await listTodos();
      setTodos(data);
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setError("");
      await addTodo(title.trim());
      setTitle("");
      await refresh();
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  async function onToggle(todo) {
    try {
      setError("");
      await updateTodo(todo.id, { done: !todo.done });
      await refresh();
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  async function onDelete(todo) {
    try {
      setError("");
      await deleteTodo(todo.id);
      await refresh();
    } catch (e) {
      setError(e.message || "Error");
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>To-Do</h1>

      <form onSubmit={onAdd} style={{ display: "flex", gap: 8 }}>
        <input
          aria-label="new-todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" style={{ padding: "10px 16px" }}>
          Add
        </button>
      </form>

      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 18 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <input
              type="checkbox"
              aria-label={`toggle-${t.id}`}
              checked={t.done}
              onChange={() => onToggle(t)}
            />
            <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </span>
            <button aria-label={`delete-${t.id}`} onClick={() => onDelete(t)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
