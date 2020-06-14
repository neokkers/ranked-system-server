const express = require("express");
const {
  getWerewolfProfiles,
  createWerewolfGame,
} = require("../controllers/werewolf");

const router = express.Router();

router.route("/profiles").get(getWerewolfProfiles);
router.route("/games").post(createWerewolfGame);

module.exports = router;
