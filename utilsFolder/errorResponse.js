// class ErrorResponse extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

const errorResponse2 = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
};
module.exports = errorResponse2;
