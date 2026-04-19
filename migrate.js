/**
 * migrate.js — SQLite → MongoDB tek seferlik taşıma scripti
 * Kullanım: MONGODB_URI=<bağlantı_adresi> node migrate.js
 */

const mongoose = require("mongoose");
const Application = require("./Application");

// Mevcut SQLite verisini buraya yapıştır (jobs.db'den dışarı aktarılmış hali)
const sqliteData = [
  {
    company: "Google",
    position: "Frontend",
    location: "İstanbul",
    salary: "45.000",
    job_url: "https://x.com/home",
    applied_at: "2026-04-16",
    status: "Beklemede",
    response_type: null,
    response_note: null,
    created_at: "2026-04-16 19:42:31",
    updated_at: "2026-04-16 19:42:31",
  },
  // Başka kayıtların varsa buraya ekle
];

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error("Hata: MONGODB_URI ortam değişkeni tanımlı değil.");
    console.error("Kullanım: MONGODB_URI=<bağlantı_adresi> node migrate.js");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB bağlandı.");

    const mevcut = await Application.countDocuments();
    if (mevcut > 0) {
      console.log(`Uyarı: Veritabanında zaten ${mevcut} kayıt var. Devam edilsin mi? (Ctrl+C ile iptal et)`);
      await new Promise((r) => setTimeout(r, 3000));
    }

    const docs = sqliteData.map(({ id, created_at, updated_at, ...rest }) => rest);
    const result = await Application.insertMany(docs);
    console.log(`✓ ${result.length} kayıt MongoDB'ye aktarıldı.`);
  } catch (err) {
    console.error("Migration hatası:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Bağlantı kapatıldı.");
  }
}

migrate();
