const mongoose = require("mongoose");

const SHGameSchema = new mongoose.Schema({
  villains: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  liberals: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  villainsWon: {
    type: Boolean,
    required: [true, "Please add a villainsWon flag"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SHGame", SHGameSchema);
