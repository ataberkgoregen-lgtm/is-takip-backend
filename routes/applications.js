const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const auth = require("../middleware/auth");

router.use(auth);

// Sadece giriş yapan kullanıcının başvurularını getir
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({
      created_at: -1,
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni başvuru ekle
router.post("/", async (req, res) => {
  const { company, position, location, salary, job_url, applied_at, status } =
    req.body;

  if (!company || !position || !applied_at)
    return res
      .status(400)
      .json({ error: "Şirket, pozisyon ve başvuru tarihi zorunludur." });

  try {
    const newApp = await Application.create({
      userId: req.userId,
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

// Güncelle (sadece kendi kaydı)
router.put("/:id", async (req, res) => {
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
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
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
    if (!updated) return res.status(404).json({ error: "Başvuru bulunamadı." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sil (sadece kendi kaydı)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json({ error: "Başvuru bulunamadı." });
    res.json({ message: "Başvuru silindi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
