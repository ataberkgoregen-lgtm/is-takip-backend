const express = require("express");
const cors = require("cors");
const applicationsRouter = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API çalışıyor." });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
