const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Player = require("../models/Players");

router.get("/profile", async (req, res) => {
  const id = req.query.id;
  try {
    const player = await Player.findById(id); // await here!
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json(player);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update player password
router.put("/updatePassword", async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, player.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    player.password = hashedNewPassword;
    await player.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
