// server.js

// Load environment variables FIRST
require('dotenv').config(); 

const http = require("http");
const app = require("./src/app");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");

// Now connect to the database
connectDB(); 

const server = http.createServer(app);
const io = new Server(server);

// Initialize the chat socket
require("./src/sockets/chat")(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});