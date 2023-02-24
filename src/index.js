const express = require("express");
require("dotenv").config();
const postsRouter = require("./routers/posts.router");

const client = require("./pgClient");

const PORT = process.env.PORT || 3000;

(async () => {
  await client.connect();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/posts", postsRouter);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
