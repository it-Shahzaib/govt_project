const express = require("express");
const router = express.Router();

const {
  createRelease,
  readRelease,
  getUnallocatedRelease,
} = require("../controllers/projectReleaseController");

router.post("/createRelease", createRelease);
router.get("/readRelease/:id", readRelease);
router.get("/readUnallocatedRelease/:id", getUnallocatedRelease);

module.exports = router;
