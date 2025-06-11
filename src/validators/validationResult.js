const { validationResult, matchedData } = require('express-validator');

/**
 * Devuelve 422 si hay errores; de lo contrario
 * coloca los datos validados y saneados en req.validated
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  req.validated = matchedData(req, { locations: ['body', 'params'] });
  next();
};
