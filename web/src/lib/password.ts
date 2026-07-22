import bcrypt from "bcryptjs";

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(candidate: string, hashed: string) {
  return bcrypt.compare(candidate, hashed);
}
