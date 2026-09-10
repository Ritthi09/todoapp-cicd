const { createApp } = require("./app");

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const app = createApp();

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
});
