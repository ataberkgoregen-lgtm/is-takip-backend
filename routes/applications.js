const express = require("express");
const router = express.Router();
const db = require("../db");

// Tüm başvuruları getir
router.get("/", (req, res) => {
  try {
    const applications = db.prepare("SELECT * FROM applications ORDER BY created_at DESC").all();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni başvuru ekle
router.post("/", (req, res) => {
  const { company, position, location, salary, job_url, applied_at, status } = req.body;

  if (!company || !position || !applied_at) {
    return res.status(400).json({ error: "Şirket, pozisyon ve başvuru tarihi zorunludur." });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO applications (company, position, location, salary, job_url, applied_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      company,
      position,
      location || "",
      salary || "",
      job_url || "",
      applied_at,
      status || "Beklemede"
    );
    const newApp = db.prepare("SELECT * FROM applications WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Başvuruyu güncelle
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { company, position, location, salary, job_url, applied_at, status, response_type, response_note } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE applications
      SET company = ?, position = ?, location = ?, salary = ?, job_url = ?,
          applied_at = ?, status = ?, response_type = ?, response_note = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(
      company, position, location || "", salary || "", job_url || "",
      applied_at, status, response_type || null, response_note || null,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Başvuru bulunamadı." });
    }

    const updated = db.prepare("SELECT * FROM applications WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Başvuruyu sil
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Başvuru bulunamadı." });
    }
    res.json({ message: "Başvuru silindi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
