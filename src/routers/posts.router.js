const express = require("express");
const z = require("zod");
const prisma = require("../prisma");

const postSchema = z.object({
  title: z.string({
    required_error: "title is required",
  }),
  body: z.string({
    required_error: "body is required",
  }),
  user_id: z.number({
    required_error: "user_id is required",
  }),
});

const validate = (schema) => async (req, res, next) => {
  const { error } = schema.safeParse(req.body);
  if (error) {
    return res.status(400).json(JSON.parse(error.message));
  }
  next();
};

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.posts.findMany();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.posts.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

router.post("/", validate(postSchema), async (req, res) => {
  const { title, body, user_id } = req.body;
  try {
    const addedPost = await prisma.posts.create({
      data: {
        title,
        body,
        user_id,
      },
    });
    res.json(addedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body, user_id } = req.body;
  try {
    const updatedPost = await prisma.posts.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        body,
        user_id,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedPost = await prisma.posts.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(deletedPost);
});

module.exports = router;
