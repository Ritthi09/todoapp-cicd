const RUNTIME =
  typeof window !== "undefined" && window.__RUNTIME_CONFIG__
    ? window.__RUNTIME_CONFIG__
    : null;

const API_URL =
  (RUNTIME && RUNTIME.API_URL) ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export async function listTodos() {
  const res = await fetch(`${API_URL}/api/todos`);
  if (!res.ok) throw new Error("Failed to load todos");
  return res.json();
}

export async function addTodo(title) {
  const res = await fetch(`${API_URL}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error("Failed to add todo");
  return res.json();
}

export async function updateTodo(id, patch) {
  const res = await fetch(`${API_URL}/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/api/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete todo");
}
