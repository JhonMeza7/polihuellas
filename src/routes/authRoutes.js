const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPassword } = require('../controllers/authController');

const {
  registerRules,
  loginRules,
  resetRules,
} = require('../validators/authValidators');
const validate = require('../validators/validationResult');

router.post('/register', registerRules, validate, registerUser);
router.post('/login',    loginRules,    validate, loginUser);
router.post('/reset',    resetRules,    validate, resetPassword);

module.exports = router;
