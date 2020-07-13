const asyncHandler = require("../middlewareFolder/async");
const SHProfile = require("../models/SH/SHProfile");
const SHGame = require("../models/SH/SHGame");
const { updateEloSH } = require("../utilsFolder/updateEloSH");

// @desc    Get profiles
// @route   GET /api/v1/sh/profiles
// @access  Public
exports.getSHProfiles = asyncHandler(async (req, res, next) => {
  const profiles = await SHProfile.find();
  res.status(200).json({ success: true, count: profiles.length, profiles });
});

// @desc    Get games
// @route   GET /api/v1/sh/games
// @access  Public
exports.getSHGames = asyncHandler(async (req, res, next) => {
  const games = await SHGame.find();
  res.status(200).json({ success: true, count: games.length, games });
});

// @desc    Create game
// @route   POST /api/v1/sh/games
// @access  Private
exports.createSHGame = asyncHandler(async (req, res, next) => {
  const game = await SHGame.create(req.body);
  await updateEloSH(game);
  res.status(201).json({ success: true, data: game });
});
