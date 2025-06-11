const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/encrypt");

const register = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("El usuario ya existe");

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Contraseña incorrecta");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
};
const resetPassword = async ({ email, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuario no encontrado");

  user.password = await hashPassword(newPassword);
  await user.save();
  return user;
};

module.exports = { register, login,resetPassword};
