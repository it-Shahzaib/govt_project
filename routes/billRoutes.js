const express = require("express");
const router = express.Router();

const billController = require("../controllers/billController");

router.post("/createBill", billController);

module.exports = router;
