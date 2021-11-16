const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const validationURL = require('../middlewares/validationURL');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), getMovies);

router.post('/movies', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
  body: Joi.object().keys({
    // валидируем body
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationURL),
    trailer: Joi.string().required().custom(validationURL),
    thumbnail: Joi.string().required().custom(validationURL),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:id', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), deleteMovie);

module.exports = router;
