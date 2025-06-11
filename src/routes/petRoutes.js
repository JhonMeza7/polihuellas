const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middleware/authMiddleware');

const {
  createPetRules,
  updatePetRules,
  idParamRule,
} = require('../validators/petValidators');
const validate = require('../validators/validationResult');

router.get('/', auth, petController.getAllPets);

router.post('/',   auth, createPetRules,  validate, petController.createPet);
router.put('/:id', auth, updatePetRules, validate, petController.updatePet);

router.delete('/:id', auth, idParamRule, validate, petController.deletePet);
router.post('/:id/like', auth, idParamRule, validate, petController.likePet);
router.get('/likes/recibidos', auth, petController.getLikesRecibidos);

module.exports = router;
