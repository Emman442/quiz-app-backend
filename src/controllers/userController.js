const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const signup = async (req, res, next) => {
  const randomNumber = Math.round(Math.random() * 100000);
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: `https://robohash.org/${randomNumber}`,
    });

    createSendToken(newUser, 201, req, res);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error?.message || "Something Went wrong, please try again later!",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide and passsword",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "failed",
        message: "Icorrect Email or password",
      });
    }

    createSendToken(user, 200, req, res);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error?.message || "Something Went wrong, please try again later!",
    });
  }
};
const protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "You are not logged in! Please log in to get access.",
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "failed",
      message: "The user belonging to this token does no longer exist.",
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "failed",
      message: "User recently changed password! Please log in again.",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

const fetchAllUsers = async (req, res, next) => {
  const users = await User.find({});
  res
    .status(200)
    .json({ message: "users fetched Successfully!", data: { users } });
};

const getMe = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id;
    const user = await User.findById(loggedInUser);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong, Please try agan later!",
    });
  }
};

const updateScore = async (req, res, next) => {
  try {
    const scorePoints = req.body.scorePoints;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      [
        {
          $set: {
            scorePoints: { $add: ["$scorePoints", Number(scorePoints)] }, // Add 50 to the existing score
          },
        },
      ],
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "User Score could not be updated, Please try agan later!",
    });
  }
};

module.exports = { signup, login, protect, fetchAllUsers, getMe, updateScore };
