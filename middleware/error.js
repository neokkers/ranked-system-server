const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = new ErrorResponse("Something went wrong :(", 500);
  console.dir(err);

  if (err.name === "ValidationError") {
    error = new ErrorResponse("Validation error", 404);
  } else if (err.name === "MongoError") {
    if (err.code === 11000)
      error = new ErrorResponse("Email already in use", 404);
  } else if (err.message === "Invalid credentials") {
    error = new ErrorResponse("Wrong data", 404);
  } else if (err.message === "No user with that email") {
    error = new ErrorResponse("Email already in use", 404);
  }
  // console.dir(err, "----");

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
