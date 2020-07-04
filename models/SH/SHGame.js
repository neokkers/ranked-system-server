const mongoose = require("mongoose");

const SHGameSchema = new mongoose.Schema({
  villains: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add villains"],
    },
  ],
  liberals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add liberals"],
    },
  ],
  mainVillain: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add a main villain"],
  },
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
