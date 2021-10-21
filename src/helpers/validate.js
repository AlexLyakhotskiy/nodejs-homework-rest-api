const {
  Types: { ObjectId },
} = require('mongoose');

function validate(schema, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart], {
      stripUnknown: true,
    });
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    req.body = validationResult.value;

    next();
  };
}

function validateId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send('Your id is not valid');
  }

  next();
}

module.exports = { validate, validateId };
