import dotenv from "dotenv";
import express from "express";
import prisma from "./prisma";
import postsRouter from "./routers/posts.router";
dotenv.config();

const PORT = process.env.PORT || 3000;

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello hell!");
  });

  app.use("/posts", postsRouter);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
