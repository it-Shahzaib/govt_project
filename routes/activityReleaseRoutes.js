const express = require("express");
const router = express.Router();

const {
  createActivityRelease,
  editRelease,
} = require("../controllers/activityReleaseController");

router.post("/createActivityRelease", createActivityRelease);
router.post("/editActivityRelease", editRelease);

module.exports = router;
