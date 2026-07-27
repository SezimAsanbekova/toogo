import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const EXPIRES = process.env.JWT_EXPIRES_IN ?? "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "partner";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
