const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const applicationsRouter = require("./routes/applications");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "https://is-takip-frontend-jet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} isteği: ${req.url}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API çalışıyor." });
});

app.use((err, req, res, next) => {
  console.error("Sunucu Hatası:", err.stack);
  res.status(500).json({ error: "Sunucu tarafında bir hata oluştu!" });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});
