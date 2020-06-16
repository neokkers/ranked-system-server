const express = require("express");
const {
  getWerewolfProfiles,
  createWerewolfGame,
  getWerewolfGames,
} = require("../controllers/werewolf");

const router = express.Router();

router.route("/profiles").get(getWerewolfProfiles);
router.route("/games").post(createWerewolfGame).get(getWerewolfGames);

module.exports = router;
