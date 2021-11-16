const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const routeUser = require('./users');
const routeMovie = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
}), createUser);

router.use(auth, routeUser);
router.use(auth, routeMovie);
router.use((_req, _res, next) => next(new NotFoundError('Запрашиваемый ресурс не существует')));

module.exports = router;
