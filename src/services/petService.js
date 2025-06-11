const Pet = require("../models/petModel");
const ChatRoom = require("../models/chatRoomModel");
const Message = require("../models/messageModel");
const createPet = async (data, userId) => {
  const pet = new Pet({ ...data, owner: userId });
  await pet.save();
  return pet;
};

const getAllPets = async () => {
  return Pet.find().populate("owner", "username");
};

const deletePet = async (id, userId) => {
  const pet = await Pet.findById(id);
  if (!pet) throw new Error("Mascota no encontrada");
  if (pet.owner.toString() !== userId) throw new Error("No autorizado");

  // Buscar los usuarios que dieron like a esta mascota
  const interesados = pet.likes;

  // Obtener todos los chats entre el dueño de la mascota y los interesados
  const chatRooms = await ChatRoom.find({
    users: { $all: [userId], $in: interesados },
  });

  const chatIds = chatRooms.map((chat) => chat._id);

  // Eliminar mensajes relacionados
  await Message.deleteMany({ chatRoom: { $in: chatIds } });

  // Eliminar los chats
  await ChatRoom.deleteMany({ _id: { $in: chatIds } });

  // Finalmente eliminar la mascota
  await Pet.findByIdAndDelete(id);
};


const likePet = async (petId, userId) => {
  const pet = await Pet.findById(petId).populate("owner");

  if (!pet) throw new Error("Mascota no encontrada");

  // Solo agregar like si aún no lo ha hecho
  if (!pet.likes.includes(userId)) {
    pet.likes.push(userId);
    await pet.save();
  }

  // Verificar si hay like mutuo (el dueño también ha dado like a una mascota del usuario)
  const petsOfUser = await Pet.find({ owner: userId });
  const hasMutual = petsOfUser.some((p) => p.likes.includes(pet.owner._id));

  if (hasMutual) {
    // Verifica si ya existe un chat entre ellos
    const exists = await ChatRoom.findOne({
      users: { $all: [userId, pet.owner._id] },
    });

    if (!exists) {
      await ChatRoom.create({ users: [userId, pet.owner._id] });
      console.log("🎉 Match detectado. ChatRoom creado.");
    }
  }

  return pet;
};

module.exports = { createPet, getAllPets, deletePet, likePet };
