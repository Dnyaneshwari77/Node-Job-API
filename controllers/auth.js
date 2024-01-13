const UserSchema = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password");
  }
  const user = await UserSchema.create({ name, email, password });
  //   const token = jwt.sign({ userID: user._id, name: user.name }, "jwtsecrete");  // instead of this use mongoose middleware
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

   const user = await UserSchema.findOne({ email });
   if (!user) {
     throw new UnauthenticatedError("Invalid Credentials");
   }
   const isPasswordCorrect = await user.comparePassword(password);
   if (!isPasswordCorrect) {
     throw new UnauthenticatedError("Invalid Credentials");
   }
   const token = user.createJWT();
   res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  login,
  register,
};
