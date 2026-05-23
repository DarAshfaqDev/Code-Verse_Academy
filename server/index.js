const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const courses = [
  "HTML Foundations",
  "CSS Design Systems",
  "JavaScript Mastery",
  "React Product Engineering",
  "Node.js API Studio",
  "Python Backend Development",
  "Python for Data Analysis",
  "SQL Practice Lab",
  "Machine Learning Launchpad",
  "Deep Learning Visualized"
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "codeverse-api" });
});

app.get("/api/courses", (_req, res) => {
  res.json({
    data: courses.map((title, index) => ({
      id: index + 1,
      title,
      lessons: 30 + index * 3,
      published: true
    }))
  });
});

app.get("/api/dashboard", (_req, res) => {
  res.json({
    streak: 21,
    xp: 18420,
    completedLessons: 284,
    badges: ["React finisher", "SQL top 5%", "AI builder"]
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email, role: "student" }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d"
  });
  res.json({ token, user: { name: "CodeVerse Student", email, role: "student" } });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`CodeVerse API running on http://localhost:${port}`);
});
