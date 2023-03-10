import { Prisma } from "@prisma/client";
import express from "express";
import prisma from "../prisma";
import { validateBody, validateParams } from "./posts.middleware";

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

router.get("/:id", validateParams, async (req, res) => {
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

router.post("/", validateBody, async (req, res) => {
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

router.put("/:id", validateParams, async (req, res) => {
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

router.delete("/:id", validateParams, async (req, res) => {
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
