const express = require("express");
const z = require("zod");
const client = require("../pgClient");

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

router.get("", async (req, res) => {
  try {
    const { rows: posts } = await client.query("SELECT * FROM public.posts");
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows: posts } = await client.query(
    "SELECT * FROM public.posts WHERE id = $1",
    [id]
  );
  if (posts.length === 0) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(posts[0]);
});

router.post("/", validate(postSchema), async (req, res) => {
  const { title, body, user_id } = req.body;
  try {
    const { rows: addedPosts } = await client.query(
      "INSERT INTO public.posts (title, body, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, body, user_id]
    );
    res.json(addedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body, user_id } = req.body;
  try {
    const { rows: oldPosts } = await client.query(
      "SELECT * FROM public.posts WHERE id = $1",
      [id]
    );
    if (oldPosts.length === 0) {
      res.status(404).json({ message: "Post not found" });
    }
    if (title) {
      oldPosts[0].title = title;
    }
    if (body) {
      oldPosts[0].body = body;
    }
    if (user_id) {
      oldPosts[0].user_id = user_id;
    }
    const { rows: updatedPosts } = await client.query(
      "UPDATE public.posts SET title = $1, body = $2, user_id = $3 WHERE id = $4 RETURNING *",
      [oldPosts[0].title, oldPosts[0].body, oldPosts[0].user_id, id]
    );
    res.json(updatedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows: deletedPosts } = await client.query(
    "DELETE FROM public.posts WHERE id = $1 returning *",
    [id]
  );
  res.json(deletedPosts);
});

module.exports = router;
