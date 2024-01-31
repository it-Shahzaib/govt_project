const express = require("express");
const router = express.Router();

const {
  readSpecificProject,
  editProjectPrice,
} = require("../controllers/projectController");

router.get("/readSpecificProject/:id", readSpecificProject);
router.post("/editProjectPrice", editProjectPrice);

module.exports = router;
