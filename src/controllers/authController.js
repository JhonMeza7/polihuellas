const authService = require("../services/authService");

const registerUser = async (req, res) => {
  try {
    const newUser = await authService.register(req.validated);
    res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.status(200).json({ message: "Login exitoso", token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const user = await authService.resetPassword(req.body);
    res.status(200).json({ message: "Contraseña actualizada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser,resetPassword  };
