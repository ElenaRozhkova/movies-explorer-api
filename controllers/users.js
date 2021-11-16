const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user');
const NotFoundError = require('../errors/not-found.js');
const UnauthorizedError = require('../errors/unauthorized-error.js');
const DublikateError = require('../errors/dublikate-error.js');
const ValidationError = require('../errors/validation-error.js');
const { JWT_SECRET } = require('../config');

const {
  STATUS_OK, STATUS_CREATE,
} = require('../utils/error.js');

module.exports.login = (req, res, next) => {
  const data = { ...req.body };
  User.findOne({ email: data.email }).select('+password')
    .then((user) => {
      if (user) {
        bcrypt.compare(data.password, user.password)
          .then((matched) => {
            if (!matched) next(new UnauthorizedError('Передан неверный логин или пароль'));
            else {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
              // вернём токен
              res.status(200).send({ token });
            }
          });
      } else next(new UnauthorizedError('Передан неверный логин или пароль'));
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(STATUS_CREATE).send({
      data: {
        email: user.email, password: user.password, name: user.name,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new DublikateError('Пользователь с указанным email уже существует'));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        return next(new DublikateError('Переданный email уже используется другим пользователем.'));
      }
      return next(err);
    });
};
