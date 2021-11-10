const Joi = require('joi');

exports.getContactsSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number().min(4).max(50),
  favorite: Joi.boolean(),
});

exports.createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

exports.updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).or('name', 'email', 'phone');

exports.updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
