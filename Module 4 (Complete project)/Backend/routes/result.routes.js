const express = require("express");

const router = express.Router();
const {
  saveResults,
  getExistingResults,
  getRegularResults,
  getSemesterResults,
} = require("../controllers/result.controller");

// Admin routes
router.post("/save", saveResults);
router.post("/existing", getExistingResults);

// Student route
// Regular results (based on className)
router.get("/regular", getRegularResults);

// Semester results (based on className)
router.get("/semester", getSemesterResults);

module.exports = router;
