const express = require("express");

const router = express.Router();

const {
  createProjectContainer,
  readAllProjectContainers,
} = require("../controllers/projectContainerController");

router.post("/createProjectContainer", createProjectContainer);
router.get("/readAllProjectContainers", readAllProjectContainers);

module.exports = router;
