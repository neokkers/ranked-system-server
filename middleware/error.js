const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = new ErrorResponse('Что-то пошло не так', 500);

  if (err.name === 'ValidationError') {
    error = new ErrorResponse('Введенные данные не прошли валидацию', 404);
  } else if (err.name === 'MongoError') {
    if (err.code === 11000) error = new ErrorResponse('Данный email уже кем-то используется', 404);
  } else if (err.message === 'Invalid credentials') {
    error = new ErrorResponse('Неверные данные', 404);
  } else if (err.message === 'No user with that email') {
    error = new ErrorResponse('Данный email не зарегистрирован', 404);
  }
  // console.dir(err, "----");

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
