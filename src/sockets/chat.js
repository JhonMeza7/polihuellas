const Message = require("../models/messageModel");
const User = require("../models/userModel");
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("joinRoom", ({ roomId, username }) => {
      socket.join(roomId);
      socket.data.username = username;
    });

    socket.on("mensajePrivado", async ({ roomId, senderId, text }) => {
      try {
        const sender = await User.findById(senderId);
        const username = sender?.username || "Anon";

        await Message.create({
          chatRoom: roomId,
          sender: senderId,
          text,
        });

        io.to(roomId).emit("mensajePrivado", { username, text });
      } catch (err) {
        console.error("❌ Error al guardar mensaje:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado:", socket.id);
    });
  });
};
