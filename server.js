const express = require("express");
const cors = require("cors");
const applicationsRouter = require("./routes/applications");

// 1. Önce sunucuyu oluşturuyoruz
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Sonra ayarları (middleware) yapıyoruz
app.use(
  cors({
    origin: "https://is-takip-frontend-jet.vercel.app", // "*" yerine tam adresini yazmak her zaman daha garantidir
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// 3. Sonra rotaları (routes) tanımlıyoruz
app.use("/api/applications", applicationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API çalışıyor." });
});

// 4. En son sunucuyu başlatıyoruz
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
