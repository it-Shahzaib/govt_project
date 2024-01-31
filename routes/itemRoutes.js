const express = require("express");

const router = express.Router();

const {
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.post("/createItem", createItem);
router.post("/updateItem", updateItem);
router.delete("/deleteItem", deleteItem);

module.exports = router;
