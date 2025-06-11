const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Importación correcta de routers
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Middleware de rutas
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.get("/", (req, res) => {
  res.redirect("/login.html");
});
module.exports = app;
