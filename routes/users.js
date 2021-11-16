const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), getUser);

router.patch('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
  body: Joi.object().keys({
    // валидируем body
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }),
}), updateUser);

module.exports = router;
