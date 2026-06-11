import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다");
}

const USERS = [
  { id: "admin", username: "admin", passwordHash: process.env.ADMIN_PASSWORD_HASH!, role: "admin" },
  { id: "sekurity", username: "sekurity", passwordHash: process.env.SEKURITY_PASSWORD_HASH!, role: "sekurity" },
  { id: "whs", username: "whs", passwordHash: process.env.WHS_PASSWORD_HASH!, role: "whs" },
];

export type UserRole = "admin" | "sekurity" | "whs";

export interface TokenPayload {
  id: string;
  username: string;
  role: UserRole;
}

export const loginUser = (
  username: string,
  password: string
): { token: string; role: UserRole } | null => {
  const user = USERS.find((u) => u.username === username);
  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return null;

  const payload: TokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role as UserRole,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  return { token, role: user.role as UserRole };
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};