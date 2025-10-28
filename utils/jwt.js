import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tv: user.tokenVersion },
    "access_token_secret",
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tv: user.tokenVersion },
    "refresh_token_sercret",
    { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
  );
}
