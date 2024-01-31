const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const util = require("util");
const promisify = util.promisify; // Convert callbacks into promises

const userModel = require("../models/userModel");

module.exports = protected = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("You are not logged in");
    }

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    const foundedUser = await userModel.findOne({ _id: decoded.id });

    if (!foundedUser) {
      throw new Error("User no longer exists log in again");
    }

    req.user = foundedUser;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
