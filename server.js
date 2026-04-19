const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const applicationsRouter = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MongoDB Bağlantısı
connectDB();

// 2. CORS Ayarları
app.use(
  cors({
    origin: "https://is-takip-frontend-jet.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// 3. İstek Loglayıcı
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} isteği: ${req.url}`);
  next();
});

// 4. Rotalar
app.use("/api/applications", applicationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API çalışıyor." });
});

// 5. Hata Yakalayıcı
app.use((err, req, res, next) => {
  console.error("Sunucu Hatası:", err.stack);
  res.status(500).json({ error: "Sunucu tarafında bir hata oluştu!" });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});
