import GitHub from "@auth/express/providers/github";
import Google from "@auth/express/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma.config";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
};
