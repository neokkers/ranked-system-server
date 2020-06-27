const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

const protectOld = asyncHandler(async (req, res, next) => {
  return next(new ErrorResponse("Not authorized to access", 401));
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (user.role !== "admin")
      return next(new ErrorResponse("Not authorized to access", 401));
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access", 401));
  }
});
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized to access" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (user.role !== "admin")
      return res.status(401).json({ error: "Not authorized to access" });
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized to access" });
  }
});

module.exports = {
  protect,
};
