const express = require("express");
const {
  register,
  login,
  sendPasswordResetEmail,
  receiveNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/reset_password/user/:email", sendPasswordResetEmail);
// router.post("/receive_new_password/:userId/:token", receiveNewPassword);

module.exports = router;
