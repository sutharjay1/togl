import jwt from "jsonwebtoken";
import type { TokenPayload } from "../types/auth.types";
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
