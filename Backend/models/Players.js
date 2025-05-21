// models/Player.js
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String, // URL or path to uploaded image
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    stats: {
      singles: {
        type: Number,
        default: 0,
      },
      doubles: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      totalpoints: {
        type: Number,
        default: 0,
      },
      winrate: {
        type: Number,
        default: 0,
      },
      bestMatch: {
        type: String,
        default: "",
      },
      rank: {
        type: Number,
        default: 0,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Player", playerSchema);
