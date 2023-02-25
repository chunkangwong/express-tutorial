import { NextFunction, Request, Response } from "express";
import z from "zod";
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

export const validateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = postSchema.safeParse(req.body);
  if (result.success === false) {
    const zError = JSON.parse(result.error.message);
    console.log(zError);
    return res.status(400).json({
      message: zError.map((err: ZodError) => err.message).join("; "),
    });
  }
  next();
};

export const validateParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = idSchema.safeParse({
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
