const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
  getRegisterTemplate,
} = require("./mailer");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewareFolder/async");
const User = require("../models/User");
const WerewolfProfile = require("../models/Werewolf/WerewolfProfile");
const SHProfile = require("../models/SH/SHProfile");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  // console.log(name, email, password, '-----');
  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) return next(ErrorResponse("Register error", 500));

  // Create game profiles
  const werewolfProfile = await WerewolfProfile.create({
    userId: user._id,
    username: user.username,
  });
  const shProfile = await SHProfile.create({
    userId: user._id,
    username: user.username,
  });

  if (!werewolfProfile || !shProfile)
    // if (!werewolfProfile)
    return next(
      ErrorResponse("Register error while creating game profiles", 500)
    );

  // Create token
  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate email & password
  if (!username || !password) {
    return next(ErrorResponse("Please provide a username and password", 400));
  }

  // Check for user
  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(ErrorResponse("Invalid credentials", 401));

  // Check pass match
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(ErrorResponse("Invalid credentials", 401));

  // Create token
  sendTokenResponse(user, 200, res);
});

// Get token and send cookie
function sendTokenResponse(user, statusCode, res) {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    // .cookie("token", token, options)
    .json({ success: true, token });
}

// RESET PASS BLOCK

// `secret` is passwordHash concatenated with user's
// createdAt value, so if someone malicious gets the
// token they still need a timestamp to hack it:
const usePasswordHashToMakeToken = ({
  password: passwordHash,
  _id: userId,
  createdAt,
}) => {
  // highlight-start
  const secret = `${passwordHash}-${createdAt}`;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 3600, // 1 hour
  });
  // highlight-end
  return token;
};

const sendPasswordResetEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  let user;

  user = await User.findOne({ email });

  if (!user) return next(ErrorResponse("No user with that email", 404));

  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);
  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        return next(ErrorResponse("Error in sending email", 500));
      }
      console.log("** Email sent **", info.response);
      res.status(200).json({ success: true });
    });
  };
  sendEmail();
});

// const sendPasswordResetEmail = async (req, res) => {

// };

const receiveNewPassword = asyncHandler(async (req, res, next) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  // highlight-start

  user = await User.findOne({ _id: userId });

  if (!user) return next(ErrorResponse("No user with that id", 404));

  const secret = `${user.password}-${user.createdAt}`;
  const payload = jwt.decode(token, secret);

  if (payload.userId === user.id) {
    bcrypt.genSalt(10, (err, salt) => {
      // Call error-handling middlewareFolder:
      if (err) return;
      bcrypt.hash(password, salt, (err, hash) => {
        // Call error-handling middlewareFolder:
        if (err) return;
        User.findOneAndUpdate({ _id: userId }, { password: hash })
          .then(() => res.status(202).json("Password changed accepted"))
          .catch((err) => next(ErrorResponse(err, 500)));
      });
    });
  }

  // User.findOne({ _id: userId })
  //   .then(user => {
  //     if (!user) res.status(404).json("Invalid user");

  //     const secret = `${user.password}-${user.createdAt}`;
  //     const payload = jwt.decode(token, secret);
  //     if (payload.userId === user.id) {
  //       bcrypt.genSalt(10, (err, salt) => {
  //         // Call error-handling middlewareFolder:
  //         if (err) return;
  //         bcrypt.hash(password, salt, (err, hash) => {
  //           // Call error-handling middlewareFolder:
  //           if (err) return;
  //           User.findOneAndUpdate({ _id: userId }, { password: hash })
  //             .then(() => res.status(202).json("Password changed accepted"))
  //             .catch(err => res.status(500).json(err));
  //         });
  //       });
  //     }
  //   })
  //   // highlight-end
  //   .catch(() => {
  //     res.status(404).json("Invalid user");
  //   });
});

module.exports = {
  register,
  login,
  usePasswordHashToMakeToken,
  sendPasswordResetEmail,
  receiveNewPassword,
};
