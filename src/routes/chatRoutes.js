// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ChatRoom = require("../models/chatRoomModel");
const Pet = require("../models/petModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

router.get("/", auth, async (req, res) => {
  const rooms = await ChatRoom.find({ users: req.user.id }).populate("users", "username");
  res.json(rooms);
});

router.post("/aceptar-match", auth, async (req, res) => {
  const { petId, interesadoId } = req.body;
  const pet = await Pet.findById(petId);
  if (!pet || String(pet.owner) !== req.user.id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const ChatRoom = require("../models/chatRoomModel");
  const yaExiste = await ChatRoom.findOne({
    users: { $all: [req.user.id, interesadoId] },
  });

  if (yaExiste) return res.json({ message: "Ya tienes un chat con esta persona" });

  await ChatRoom.create({ users: [req.user.id, interesadoId] });
  res.json({ message: "Match aceptado y chat habilitado" });
});



router.get("/:roomId/mensajes", auth, async (req, res) => {
  try {
    const mensajes = await Message.find({ chatRoom: req.params.roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(mensajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
