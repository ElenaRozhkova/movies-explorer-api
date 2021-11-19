const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

router.get('/users/me', getUser);

router.patch('/users/me', validationUpdateUser, updateUser);

module.exports = router;
