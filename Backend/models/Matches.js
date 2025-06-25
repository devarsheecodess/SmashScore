const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["singles", "doubles"],
      required: true,
      default: "singles",
    },
    player1: {
      type: String,
      trim: true,
    },
    player1ID: {
      type: String,
      trim: true,
    },
    player2: {
      type: String,
      trim: true,
    },
    player2ID: {
      type: String,
      trim: true,
    },
    team1Name: {
      type: String,
      trim: true,
    },
    team2Name: {
      type: String,
      trim: true,
    },
    team1Players: {
      type: [String],
      default: ["", ""], // Array of 2 players (for doubles)
    },
    team1PlayersID: {
      type: [String],
      default: ["", ""], // Array of 2 players (for doubles)
    },
    team2Players: {
      type: [String],
      default: ["", ""], // Array of 2 players (for doubles)
    },
    team2PlayersID: {
      type: [String],
      default: ["", ""], // Array of 2 players (for doubles)
    },
    date: {
      type: Date,
    },
    time: {
      type: String, // Keeping time separate as string
    },
    totalPoints: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed"],
      default: "Upcoming",
    },
    winner: {
      type: String,
      trim: true,
    },
    score: {
      type: String,
      trim: true,
    },
    margin: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Matches", matchSchema);

module.exports = Match;
