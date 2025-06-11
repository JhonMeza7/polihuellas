const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, petController.getAllPets);
router.post("/", auth, petController.createPet);
router.delete("/:id", auth, petController.deletePet);
router.post("/:id/like", auth, petController.likePet);
router.get("/likes/recibidos", auth, petController.getLikesRecibidos);
router.put("/:id", auth, petController.updatePet);

module.exports = router;
