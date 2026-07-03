import express, { type CookieOptions, type ErrorRequestHandler, type Request } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { canAccessRole, loginUser, verifyToken, type UserRole } from "./auth.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const AUTH_COOKIE_NAME = "portfolio_token";
const TOKEN_TTL_MS = 15 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

const defaultAllowedOrigins = ["https://fev20.github.io", "https://miel02.site"];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS?.split(",") ?? defaultAllowedOrigins)
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: TOKEN_TTL_MS,
  path: "/",
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

const protectedFilesPath = process.env.PROTECTED_FILES_DIR
  ? path.resolve(process.env.PROTECTED_FILES_DIR)
  : path.resolve(__dirname, "..", "server", "protected-files");

const protectedFiles: Record<string, UserRole> = {
  "seKUrity1.pdf": "sekurity",
  "seKUrity2.pdf": "sekurity",
  "seKUrity3.pdf": "sekurity",
  "seKUrity4.pdf": "sekurity",
  "seKUrity5.pdf": "sekurity",
  "seKUrity6.pdf": "sekurity",
  "seKUrity7.pdf": "sekurity",
  "seKUrity8.pdf": "sekurity",
  "seKUrity9.pdf": "sekurity",
};

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const loginAttempts = new Map<string, LoginAttempt>();

function getClientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function getLoginAttempt(req: Request) {
  const key = getClientKey(req);
  const now = Date.now();
  const attempt = loginAttempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    const freshAttempt = { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(key, freshAttempt);
    return freshAttempt;
  }
  return attempt;
}

function isLoginRateLimited(req: Request) {
  return getLoginAttempt(req).count >= LOGIN_MAX_ATTEMPTS;
}

function registerFailedLogin(req: Request) {
  const attempt = getLoginAttempt(req);
  attempt.count += 1;
}

function clearLoginAttempts(req: Request) {
  loginAttempts.delete(getClientKey(req));
}

function getCookieValue(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");
    if (rawKey !== name) continue;
    try {
      return decodeURIComponent(rawValue.join("="));
    } catch {
      return rawValue.join("=");
    }
  }

  return null;
}

function getRequestToken(req: Request) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return getCookieValue(req, AUTH_COOKIE_NAME);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  const staticPath =
    isProduction
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
    next();
  });

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10kb", strict: true }));

  app.post("/api/login", (req, res) => {
    if (isLoginRateLimited(req)) {
      return res.status(429).json({ message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." });
    }

    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
      registerFailedLogin(req);
      return res.status(400).json({ message: "아이디와 비밀번호가 필요합니다." });
    }

    const result = loginUser(username, password);
    if (!result) {
      registerFailedLogin(req);
      return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    clearLoginAttempts(req);
    res.cookie(AUTH_COOKIE_NAME, result.token, authCookieOptions);
    res.json({ role: result.role });
  });

  app.post("/api/logout", (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      path: authCookieOptions.path,
      sameSite: authCookieOptions.sameSite,
      secure: authCookieOptions.secure,
    });
    res.status(204).end();
  });

  app.get("/api/verify", (req, res) => {
    const token = getRequestToken(req);
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ valid: false });
    }
    res.json({ valid: true, role: payload.role, username: payload.username });
  });

  app.get("/api/files/:fileName", (req, res) => {
    const fileName = path.basename(req.params.fileName);
    if (fileName !== req.params.fileName) {
      return res.status(400).json({ message: "잘못된 파일 경로입니다." });
    }

    const requiredRole = protectedFiles[fileName];
    if (!requiredRole) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    const token = getRequestToken(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) {
      return res.status(401).json({ valid: false });
    }
    if (!canAccessRole(payload.role, requiredRole)) {
      return res.status(403).json({ message: "파일에 접근할 권한이 없습니다." });
    }

    res.setHeader("Cache-Control", "private, no-store");
    res.download(path.join(protectedFilesPath, fileName), fileName, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ message: "파일을 찾을 수 없습니다." });
      }
    });
  });

  app.get("/files/:fileName", (req, res, next) => {
    const fileName = path.basename(req.params.fileName);
    if (protectedFiles[fileName]) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }
    next();
  });

  app.use(
    express.static(staticPath, {
      setHeaders(res) {
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (res.headersSent) return;

    if (err?.type === "entity.parse.failed") {
      res.status(400).json({ message: "잘못된 JSON 요청입니다." });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  };
  app.use(errorHandler);

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  if (isProduction) {
    setInterval(() => {
      fetch("https://portfolio-8ihh.onrender.com/")
        .catch(() => {});
    }, 5 * 60 * 1000);
  }
}

startServer().catch(console.error);
