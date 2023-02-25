import express, { Request, Response, NextFunction } from "express";
import z from "zod";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod/lib";

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

const idSchema = z.object({
  id: z.number({
    required_error: "id is required",
  }),
});

const validateBody =
  (schema: typeof postSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success === false) {
      const zError = JSON.parse(result.error.message);
      console.log(zError);
      return res.status(400).json({
        message: zError.map((err: ZodError) => err.message).join("; "),
      });
    }
    next();
  };

const validateParams =
  (schema: typeof idSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      id: Number(req.params.id),
    });
    if (result.success === false) {
      const zError = JSON.parse(result.error.message);
      console.log(zError);
      return res.status(400).json({
        message: zError.map((err: ZodError) => err.message).join("; "),
      });
    }
    next();
  };

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.posts.findMany();
    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", validateParams(idSchema), async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", validateBody(postSchema), async (req, res) => {
  const { title, body, user_id } = req.body;
  try {
    const addedPost = await prisma.posts.create({
      data: {
        title,
        body,
        user_id,
      },
    });
    return res.json(addedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", validateParams(idSchema), async (req, res) => {
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
    return res.json(updatedPost);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Post not found" });
      }
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", validateParams(idSchema), async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await prisma.posts.delete({
      where: {
        id: Number(id),
      },
    });
    return res.json(deletedPost);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Post not found" });
      }
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
