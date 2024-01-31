const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

const { JWT_SECRET, JWT_EXPIRE_IN } = process.env;

const signToken = (id) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE_IN,
  });
  return token;
};

const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await userModel.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
    });

    createUser.password = undefined;

    const token = signToken(createUser._id);

    res.status(201).json({
      status: true,
      msg: "User Registered successfully",
      user: {
        token,
        user: createUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    const foundedUser = await userModel.findOne({ email }).select("+password");

    if (!foundedUser) {
      throw new Error("Incorrect email or password");
    }

    const passwordMatch = await bcrypt.compare(password, foundedUser.password);

    if (!passwordMatch) {
      throw new Error("Incorrect Password");
    }

    const token = signToken(foundedUser._id);

    res.status(200).json({
      status: true,
      msg: "User logged in successfully",
      data: token,
    });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = {
  signup,
  login,
};
