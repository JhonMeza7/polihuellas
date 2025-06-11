const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🟢 Conectado a MongoDB");
  } catch (err) {
    console.error("🔴 Error al conectar DB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
