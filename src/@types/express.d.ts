/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type User } from "@prisma/client";

// Add  user  to the  Request  interface in the  src/@types/express.d.ts  file:
declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
