// src/validators/authValidators.js
const { check } = require('express-validator');

exports.registerRules = [
  check('username')
    .trim()
    .notEmpty().withMessage('Usuario requerido')
    .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),

  check('email')
    .normalizeEmail()
    .isEmail().withMessage('Correo inválido'),

  check('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe incluir mayúscula')
    .matches(/[0-9]/).withMessage('Debe incluir número'),
];

exports.loginRules = [
  check('email').isEmail().withMessage('Correo inválido'),
  check('password').notEmpty().withMessage('Contraseña requerida'),
];

exports.resetRules = [
  check('email').isEmail().withMessage('Correo inválido'),
  check('newPassword')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres'),
];
