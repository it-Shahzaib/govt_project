const express = require("express");

const router = express.Router();

const {
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

router.post("/createActivity", createActivity);
router.post("/updateActivity", updateActivity);
router.delete("/deleteActivity", deleteActivity);

module.exports = router;
