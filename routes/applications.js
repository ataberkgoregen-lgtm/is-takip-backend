const express = require("express");
const router = express.Router();
const Application = require("../Application");

// Tüm başvuruları getir
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ created_at: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni başvuru ekle
router.post("/", async (req, res) => {
  const { company, position, location, salary, job_url, applied_at, status } =
    req.body;

  if (!company || !position || !applied_at) {
    return res
      .status(400)
      .json({ error: "Şirket, pozisyon ve başvuru tarihi zorunludur." });
  }

  try {
    const newApp = await Application.create({
      company,
      position,
      location: location || "",
      salary: salary || "",
      job_url: job_url || "",
      applied_at,
      status: status || "Beklemede",
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Başvuruyu güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    company,
    position,
    location,
    salary,
    job_url,
    applied_at,
    status,
    response_type,
    response_note,
  } = req.body;

  try {
    const updated = await Application.findByIdAndUpdate(
      id,
      {
        company,
        position,
        location: location || "",
        salary: salary || "",
        job_url: job_url || "",
        applied_at,
        status,
        response_type: response_type || null,
        response_note: response_note || null,
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Başvuru bulunamadı." });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Başvuruyu sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Başvuru bulunamadı." });
    }
    res.json({ message: "Başvuru silindi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
