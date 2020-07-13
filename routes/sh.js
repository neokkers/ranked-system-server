const express = require("express");
const {
  getSHProfiles,
  getSHGames,
  createSHGame,
} = require("../controllers/sh");
const router = express.Router();
const { protect } = require("../middlewareFolder/auth");

router.route("/profiles").get(getSHProfiles);
router.route("/games").get(getSHGames).post(protect, createSHGame);

module.exports = router;
