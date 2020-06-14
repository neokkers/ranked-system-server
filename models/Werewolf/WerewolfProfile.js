const mongoose = require("mongoose");

const WerewolfProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add a user"],
  },
  username: {
    type: String,
    required: [true, "Please add a username"],
  },
  elo: {
    type: Number,
    default: 800,
  },
  won: {
    type: Number,
    default: 0,
  },
  lost: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("WerewolfProfile", WerewolfProfileSchema);
