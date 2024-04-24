import * as crypto from "crypto";
export function signToken(userId: string) {
  return crypto.createSign("RSA-SHA256").update(userId).sign(process.env.JWT_SECRET!, "base64");
}
