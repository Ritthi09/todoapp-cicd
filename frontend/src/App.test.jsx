import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import * as api from "./api.js";

describe("App", () => {
  test("renders and can add a todo", async () => {
    const user = userEvent.setup();

    vi.spyOn(api, "listTodos")
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "1", title: "Hello", done: false, createdAt: new Date().toISOString() }]);
    vi.spyOn(api, "addTodo").mockResolvedValueOnce({ id: "1", title: "Hello", done: false });

    render(<App />);

    expect(await screen.findByText("To-Do")).toBeInTheDocument();

    await user.type(screen.getByLabelText("new-todo"), "Hello");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(await screen.findByText("Hello")).toBeInTheDocument();
  });

  test("can toggle and delete", async () => {
    const user = userEvent.setup();

    vi.spyOn(api, "listTodos").mockResolvedValueOnce([
      { id: "1", title: "Task", done: false, createdAt: new Date().toISOString() }
    ]);
    vi.spyOn(api, "updateTodo").mockResolvedValueOnce({ id: "1", title: "Task", done: true });
    vi.spyOn(api, "deleteTodo").mockResolvedValueOnce();

    render(<App />);

    expect(await screen.findByText("Task")).toBeInTheDocument();

    await user.click(screen.getByLabelText("toggle-1"));
    expect(api.updateTodo).toHaveBeenCalled();

    await user.click(screen.getByLabelText("delete-1"));
    expect(api.deleteTodo).toHaveBeenCalled();
  });
});
