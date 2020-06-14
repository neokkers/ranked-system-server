const mongoose = require("mongoose");

// import WerewolfProfileSchema from "./WerewolfProfile";
// import UserSchema from "../User";
const WerewolfGameSchema = new mongoose.Schema({
  wolves: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  villagers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  wolvesWon: {
    type: Boolean,
    required: [true, "Please add a wolvesWon"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WerewolfGame", WerewolfGameSchema);
