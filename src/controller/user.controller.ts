import prisma from "$/config/prisma.config";
import { loginSchema, registerSchema } from "$/utils/types";
import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { signToken } from "$/utils/auth";

export const login = async (req: Request, res: Response) => {
  loginSchema.parse(req.body);
  const safeBody = loginSchema.safeParse(req.body);
  if (!safeBody.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: safeBody.error });
  }

  // user can login with either phone or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: safeBody.data.email,
        },
        {
          phoneNumber: safeBody.data.email,
        },
      ],
    },
  });
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(safeBody.data.password, user.password!);

  if (!isPasswordValid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }
  const token = signToken(user.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Logged in successfully", token })
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
};

export const register = async (req: Request, res: Response) => {
  registerSchema.parse(req.body);
  const safeBody = registerSchema.safeParse(req.body);
  if (!safeBody.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: safeBody.error });
  }

  const hashedPassword = await bcrypt.hash(safeBody.data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...safeBody.data,
      password: hashedPassword,
    },
  });

  const token = signToken(user.id);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "User registered successfully", token })
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
  });
  res.status(StatusCodes.OK).json({ user });
};
export default {
  login,
};

export const signout = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
  });
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  // clear the token cookie and token from the database
  await prisma.session.deleteMany({
    where: {
      userId: req.user?.id,
    },
  });

  res.clearCookie("session");
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};
