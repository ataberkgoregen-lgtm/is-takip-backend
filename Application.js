const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company:       { type: String, required: true },
    position:      { type: String, required: true },
    location:      { type: String, default: "" },
    salary:        { type: String, default: "" },
    job_url:       { type: String, default: "" },
    applied_at:    { type: String, required: true },
    status:        { type: String, default: "Beklemede" },
    response_type: { type: String, default: null },
    response_note: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Application", applicationSchema);
