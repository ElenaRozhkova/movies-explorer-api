const router = require('express').Router();
const routeUser = require('./users');
const routeMovie = require('./movies');
const auth = require('../middlewares/auth');
const { validationLogin, validationSignup } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found');

router.post('/signin', validationLogin, login);
router.post('/signup', validationSignup, createUser);

router.use(auth, routeUser);
router.use(auth, routeMovie);
router.use((_req, _res, next) => next(new NotFoundError('Запрашиваемый ресурс не существует')));

module.exports = router;
