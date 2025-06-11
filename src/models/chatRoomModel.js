// src/models/chatRoomModel.js
const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
