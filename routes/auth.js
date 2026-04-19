const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email ve şifre zorunludur." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı." });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: "Şifre hatalı." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni kullanıcı oluştur (sadece sen çağırırsın, bu endpoint'i sonradan kaldırabilirsin)
router.post("/create-user", authMiddleware, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Ad, email ve şifre zorunludur." });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Bu email zaten kayıtlı." });

    const user = await User.create({ name, email, password });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
