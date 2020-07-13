const express = require("express");
const {
  getWerewolfProfiles,
  createWerewolfGame,
  getWerewolfGames,
} = require("../controllers/werewolf");
const ErrorResponse = require("../utils/errorResponse");
const router = express.Router();
const { protect } = require("../middlewareFolder/auth");

router.route("/profiles").get(getWerewolfProfiles);
router.route("/games").get(getWerewolfGames).post(protect, createWerewolfGame);

module.exports = router;
