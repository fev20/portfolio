import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다");
}
if (JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET은 최소 32자 이상이어야 합니다");
}

const JWT_ISSUER = "portfolio-api";
const JWT_AUDIENCE = "portfolio-client";

const USERS = [
  { id: "admin", username: "admin", passwordHash: process.env.ADMIN_PASSWORD_HASH!, role: "admin" },
  { id: "sekurity", username: "sekurity", passwordHash: process.env.SEKURITY_PASSWORD_HASH!, role: "sekurity" },
  { id: "whs", username: "whs", passwordHash: process.env.WHS_PASSWORD_HASH!, role: "whs" },
];

for (const user of USERS) {
  if (!user.passwordHash) {
    throw new Error(`${user.username} password hash 환경변수가 설정되지 않았습니다`);
  }
}

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
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 64 ||
    password.length > 256
  ) {
    return null;
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = USERS.find((u) => u.username === normalizedUsername);
  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return null;

  const payload: TokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role as UserRole,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    audience: JWT_AUDIENCE,
    expiresIn: "15m",
    issuer: JWT_ISSUER,
  });
  return { token, role: user.role as UserRole };
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER,
    }) as TokenPayload;
  } catch {
    return null;
  }
};

export const canAccessRole = (
  userRole: UserRole | null | undefined,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;
  if (userRole === "admin") return true;
  return userRole === requiredRole;
};
