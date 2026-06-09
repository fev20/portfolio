import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio_secret_key_2026";

const USERS = [
  {
    id: "admin",
    username: "admin",
    passwordHash: bcrypt.hashSync("sumin@3997", 10),
    role: "admin",
  },
  {
    id: "sekurity",
    username: "sekurity",
    passwordHash: bcrypt.hashSync("sekurity2026", 10),
    role: "sekurity",
  },
  {
    id: "whs",
    username: "whs",
    passwordHash: bcrypt.hashSync("whs2026", 10),
    role: "whs",
  },
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

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { token, role: user.role as UserRole };
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};