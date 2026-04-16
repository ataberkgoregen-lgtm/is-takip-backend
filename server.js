const express = require("express");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const applicationsRouter = require("./routes/applications");
app.use("/api/applications", applicationsRouter);
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API çalışıyor." });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
