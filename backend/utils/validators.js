const validator = require('validator');
const { Segments } = require('celebrate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const getUserAuthSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(200),
    name: Joi.string().min(2).max(30),
  }),
};

const getCurrentUserSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

const getCreateArticlesSchema = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(validateURL).required(),
    image: Joi.string().custom(validateURL).required(),
  }),
};

const getDeleteArticlesSchema = {
  body: Joi.object().keys({
    owner: Joi.objectId().required(),
  }),
};

module.exports = {
  getUserAuthSchema,
  getCurrentUserSchema,
  getCreateArticlesSchema,
  getDeleteArticlesSchema,
};
