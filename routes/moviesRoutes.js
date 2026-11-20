const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController.js');
const { verify, verifyAdmin } = require('../auth.js');

router.post('/addMovie', verify, verifyAdmin, movieController.addMovie);
router.get('/getMovies', movieController.getMovies);
router.get('/getMovie/:movieId', movieController.getMovieById);
router.patch('/updateMovie/:movieId', verify, verifyAdmin, movieController.updateMovie);
router.delete('/deleteMovie/:movieId', verify, verifyAdmin, movieController.deleteMovie);
router.patch('/addComment/:movieId', verify, movieController.addMovieComment);
router.get('/getComments/:movieId', movieController.getMovieComments);

module.exports = router;