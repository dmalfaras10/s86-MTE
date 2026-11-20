const Movie = require('../models/Movie.js');
const { errorHandler } = require('../auth.js');

module.exports.addMovie = (req, res) => {
  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Authentication required. Please log in."
    });
  } else if (!req.user.isAdmin) {
    return res.status(403).send({
      success: false,
      message: "Admin access required to add movies."
    });
  } else if (!req.body.title || !req.body.director || !req.body.year || !req.body.description || !req.body.genre) {
    return res.status(400).send({
      success: false,
      message: "Movie title, director, year, description, and genre are required."
    });
  } else {
    return Movie.findOne({
      title: req.body.title.trim(),
      year: req.body.year
    })
      .then(existingMovie => {
        if (existingMovie) {
          return res.status(409).send({
            success: false,
            message: "A movie with this title and release year already exists."
          });
        }

        let newMovie = new Movie({
          title: req.body.title.trim(),
          director: req.body.director.trim(),
          year: req.body.year,
          description: req.body.description.trim(),
          genre: req.body.genre.trim()
        });

        return newMovie.save()
          .then(movie => res.status(201).send({
            success: true,
            message: "Movie added successfully",
            movie
          }));
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.getMovies = (req, res) => {
  return Movie.find({})
    .then(movies => {
      if (movies.length > 0) {
        return res.status(200).send({
          success: true,
          movies
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "No movies found in the catalog."
        });
      }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getMovieById = (req, res) => {
  let movieId = req.params.movieId.replace(/^"+|"+$/g, "").trim();

  if (!movieId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing movie ID."
    });
  } else {
    return Movie.findById(movieId)
      .then(movie => {
        if (movie) {
          return res.status(200).send({
            success: true,
            movie
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Movie not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.updateMovie = (req, res) => {
  let movieId = req.params.movieId.replace(/^"+|"+$/g, "").trim();

  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Authentication required. Please log in."
    });
  } else if (!req.user.isAdmin) {
    return res.status(403).send({
      success: false,
      message: "Admin access required to update movies."
    });
  } else if (!movieId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing movie ID."
    });
  } else {
    let updatedMovie = {
      title: req.body.title,
      director: req.body.director,
      year: req.body.year,
      description: req.body.description,
      genre: req.body.genre
    };

    return Movie.findByIdAndUpdate(movieId, updatedMovie, { returnDocument: 'after', runValidators: true })
      .then(movie => {
        if (movie) {
          return res.status(200).send({
            success: true,
            message: "Movie updated successfully",
            updatedMovie: movie
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Movie not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.deleteMovie = (req, res) => {
  let movieId = req.params.movieId.replace(/^"+|"+$/g, "").trim();

  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Authentication required. Please log in."
    });
  } else if (!req.user.isAdmin) {
    return res.status(403).send({
      success: false,
      message: "Admin access required to delete movies."
    });
  } else if (!movieId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing movie ID."
    });
  } else {
    return Movie.findByIdAndDelete(movieId)
      .then(movie => {
        if (movie) {
          return res.status(200).send({
            success: true,
            message: "Movie deleted successfully"
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Movie not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.addMovieComment = (req, res) => {
  let movieId = req.params.movieId.replace(/^"+|"+$/g, "").trim();

  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Authentication required. Please log in."
    });
  } else if (!movieId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing movie ID."
    });
  } else if (!req.body.comment || !req.body.comment.trim()) {
    return res.status(400).send({
      success: false,
      message: "Comment text is required."
    });
  } else {
    let newComment = {
      userId: req.user.id,
      comment: req.body.comment.trim()
    };

    return Movie.findByIdAndUpdate(
      movieId,
      { $push: { comments: newComment } },
      { returnDocument: 'after', runValidators: true }
    )
      .then(movie => {
        if (movie) {
          return res.status(201).send({
            success: true,
            message: "Comment added successfully",
            updatedMovie: movie
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Movie not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};

module.exports.getMovieComments = (req, res) => {
  let movieId = req.params.movieId.replace(/^"+|"+$/g, "").trim();

  if (!movieId) {
    return res.status(400).send({
      success: false,
      message: "Invalid or missing movie ID."
    });
  } else {
    return Movie.findById(movieId)
      .then(movie => {
        if (movie) {
          return res.status(200).send({
            success: true,
            comments: movie.comments
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Movie not found."
          });
        }
      })
      .catch(error => errorHandler(error, req, res));
  }
};