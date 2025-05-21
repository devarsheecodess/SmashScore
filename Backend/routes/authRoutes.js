const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const Player = require("../models/Players");

router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, username, email, age, gender, password } = req.body;

    // Check for existing user
    const existingUser = await Player.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get uploaded image URL
    const profilePic = req.file ? req.file.path : "";

    // Create new player
    const newPlayer = new Player({
      name,
      username,
      email,
      age,
      gender,
      password: hashedPassword,
      profilePic,
    });

    await newPlayer.save();
    res.status(201).json({
      message: "Signup successful",
      player: newPlayer,
      _id: newPlayer._id,
      username: req.body.username,
      profilePic: req.body.profilePic,
      isAdmin: newPlayer.isAdmin || false,
      name: player.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt with username:", username);
    console.log("Login attempt with password:", password);

    // Find user by username
    const player = await Player.findOne({ username });
    if (!player) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // Send user data without password
    const { password: _, ...userData } = player._doc;
    res.status(200).json({
      message: "Login successful",
      player: userData,
      username: player.username,
      id: player._id,
      profilePic: player.profilePic,
      isAdmin: player.isAdmin || false,
      name: player.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Check if user is an admin
router.get("/checkAdmin", async (req, res) => {
  try {
    const playerId = req.query.id;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const isAdmin = player.isAdmin || false;
    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error checking admin status", error: error.message });
  }
});

module.exports = router;
