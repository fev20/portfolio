import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { loginUser, verifyToken } from "./auth.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

app.use(cors({
  origin: ["https://fev20.github.io", "https://miel02.site"],
  credentials: true,
}));

  app.use(express.json());

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const result = loginUser(username, password);
    if (!result) {
      return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }
    res.json({ token: result.token, role: result.role });
  });

  app.get("/api/verify", (req, res) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false });
    }
    const token = auth.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ valid: false });
    }
    res.json({ valid: true, role: payload.role, username: payload.username });
  });

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  if (process.env.NODE_ENV === "production") {
    setInterval(() => {
      fetch("https://portfolio-8ihh.onrender.com/api/verify")
        .catch(() => {});
    }, 5 * 60 * 1000);
  }
}

startServer().catch(console.error);
