const petService = require("../services/petService");
const Pet = require("../models/petModel");
const User = require("../models/userModel");

const createPet = async (req, res) => {
  try {
    const pet = await petService.createPet(req.body, req.user.id);
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllPets = async (req, res) => {
  try {
    const pets = await petService.getAllPets();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePet = async (req, res) => {
  try {
    await petService.deletePet(req.params.id, req.user.id);
    res.json({ message: "Mascota eliminada" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

const likePet = async (req, res) => {
  try {
    const pet = await petService.likePet(req.params.id, req.user.id);
    res.json({ message: "Mascota likeada", pet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getLikesRecibidos = async (req, res) => {
  try {
    const misMascotas = await Pet.find({ owner: req.user.id }).populate("likes");
    const resultado = misMascotas.map(p => ({
      petId: p._id,
      petName: p.name,
      interesados: p.likes.map(u => ({
        id: u._id,
        username: u.username,
        email: u.email,
      })),
    }));
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

  // Solo el dueño puede editar
  if (String(pet.owner) !== req.user.id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  Object.assign(pet, req.body);
  await pet.save();
  res.json({ message: "Mascota actualizada" });
};
module.exports = { createPet, getAllPets, deletePet, likePet,getLikesRecibidos,updatePet };
