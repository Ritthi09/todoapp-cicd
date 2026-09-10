const request = require("supertest");
const { createApp } = require("../src/app");

describe("ToDo API", () => {
  test("GET /health returns ok", async () => {
    const app = createApp();
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("CRUD /api/todos", async () => {
    const app = createApp();

    // empty
    let res = await request(app).get("/api/todos");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);

    // create
    res = await request(app)
      .post("/api/todos")
      .set("Content-Type", "application/json")
      .send({ title: "Write tests" });
    expect(res.statusCode).toBe(201);
    const id = res.body.id;

    // update done
    res = await request(app)
      .put(`/api/todos/${id}`)
      .set("Content-Type", "application/json")
      .send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);

    // delete
    res = await request(app).delete(`/api/todos/${id}`);
    expect(res.statusCode).toBe(204);

    // back to empty
    res = await request(app).get("/api/todos");
    expect(res.body).toEqual([]);
  });

  test("POST validates input", async () => {
    const app = createApp();
    const res = await request(app).post("/api/todos").send({});
    expect(res.statusCode).toBe(400);
  });
});
