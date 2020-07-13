const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utilsFolder/errorResponse");
const User = require("../models/User");

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
