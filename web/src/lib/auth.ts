import jwt from "jsonwebtoken";

export type JwtPayload = {
  sub: string;
  email: string;
  role: "user" | "admin";
};

const secret = process.env.JWT_SECRET ?? "development-secret";

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, secret) as JwtPayload;
}
