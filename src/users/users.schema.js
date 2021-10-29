const Joi = require('joi');

exports.signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

exports.loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

exports.updateUserSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});
