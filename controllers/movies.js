const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found.js');
const ValidationError = require('../errors/validation-error.js');
const ForbiddenError = require('../errors/forbidden-error.js');

const {
  STATUS_OK, STATUS_CREATE,
} = require('../utils/error.js');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;

  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_CREATE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм по указанному _id не найден!'));
      }
      if (movie.owner.toString() === req.user._id) {
        return movie.remove()
          .then(() => res.status(STATUS_OK).send(movie));
      }
      return next(new ForbiddenError('Вы не можете удалять фильм других пользователей.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      }
      throw err;
    })
    .catch(next);
};
