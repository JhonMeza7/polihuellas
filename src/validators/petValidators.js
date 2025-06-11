const { check, param } = require('express-validator');

exports.createPetRules = [
  check('name').notEmpty().withMessage('Nombre requerido'),
  check('species').notEmpty().withMessage('Especie requerida'),
  check('age').optional().isInt({ min: 0 }).withMessage('Edad debe ser entera ≥ 0'),
];

exports.updatePetRules = [
  param('id').isMongoId().withMessage('ID inválido'),
  check('name').optional().notEmpty(),
  check('species').optional().notEmpty(),
  check('age').optional().isInt({ min: 0 }),
];

exports.idParamRule = [
  param('id').isMongoId().withMessage('ID inválido'),
];
