const express = require("express");
const z = require("zod");

const postSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  body: z.string({
    required_error: "Body is required",
  }),
  userId: z.number({
    required_error: "UserId is required",
  }),
});

const validate = (schema) => async (req, res, next) => {
  const { error } = schema.safeParse(req.body);
  if (error) {
    return res.status(400).json(JSON.parse(error.message));
  }
  next();
};

const posts = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
];

const router = express.Router();

router.get("", (req, res) => {
  res.json(posts);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === parseInt(id));
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

router.post("/", validate(postSchema), (req, res) => {
  const post = req.body;
  post.id = Math.max(...posts.map((post) => post.id)) + 1;
  posts.push(post);
  res.json(post);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === parseInt(id));
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  const { title, body, userId } = req.body;
  if (title) {
    post.title = title;
  }
  if (body) {
    post.body = body;
  }
  if (userId) {
    post.userId = userId;
  }
  res.json(post);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((post) => post.id === parseInt(id));
  if (postIndex === -1) {
    res.status(404).json({ message: "Post not found" });
  }
  const post = posts[postIndex];
  posts.splice(postIndex, 1);
  res.json(post);
});

module.exports = router;
