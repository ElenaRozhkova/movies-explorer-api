const router = require('express').Router();
const { validationCreateUser, validationID } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validationCreateUser, createMovie);
router.delete('/movies/:id', validationID, deleteMovie);

module.exports = router;
