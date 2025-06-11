const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
