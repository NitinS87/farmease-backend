import prisma from "$/config/prisma.config";
import { type Request, type NextFunction, type Response } from "express";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Add your authentication logic here
  const sessionToken = req.headers.authorization;
  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = session.user;

  next();
}
