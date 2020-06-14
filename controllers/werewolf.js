const asyncHandler = require("../middleware/async");
const WerewolfProfile = require("../models/Werewolf/WerewolfProfile");
const WerewolfGame = require("../models/Werewolf/WerewolfGame");

// @desc    Get profiles
// @route   GET /api/v1/werewolf/profiles
// @access  Public
exports.getWerewolfProfiles = asyncHandler(async (req, res, next) => {
  const werewolfProfiles = await WerewolfProfile.find();
  res
    .status(200)
    .json({ success: true, count: werewolfProfiles.length, werewolfProfiles });
});

// @desc    Create game
// @route   POST /api/v1/werewolf/games
// @access  Private
exports.createWerewolfGame = asyncHandler(async (req, res, next) => {
  const game = await WerewolfGame.create(req.body);

  res.status(201).json({ success: true, data: game });
});
