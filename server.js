const express = require("express");
const cors = require("cors");
const applicationsRouter = require("./routes/applications");

// 1. Önce sunucuyu oluşturuyoruz
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Sonra ayarları (middleware) yapıyoruz
app.use(cors()); // CORS her zaman en üstte olmalı
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
