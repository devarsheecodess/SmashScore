const express = require("express");
const router = express.Router();

const Player = require("../models/Players");
const Match = require("../models/Matches");

router.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    const data = {
      players: players.map((player) => ({
        id: player._id,
        name: player.name,
        rank: player.stats.rank,
        avatar: player.profilePic,
      })),
    };
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/addMatch", async (req, res) => {
  try {
    const {
      type,
      player1,
      player1ID,
      player2,
      player2ID,
      team1Name,
      team2Name,
      team1Players,
      team1PlayersID,
      team2Players,
      team2PlayersID,
      date,
      time,
      totalPoints,
      description,
    } = req.body;

    // Prepare match data, casting date and totalPoints
    const matchData = {
      type,
      player1,
      player1ID,
      player2,
      player2ID,
      team1Name,
      team2Name,
      team1Players,
      team1PlayersID,
      team2Players,
      team2PlayersID,
      date: new Date(date),
      time,
      totalPoints: Number(totalPoints),
      description,
    };

    // Optional: add validation here for required fields depending on type

    const newMatch = new Match(matchData);
    await newMatch.save();

    res
      .status(201)
      .json({ message: "Match created successfully", match: newMatch });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // start of tomorrow

    const matches = await Match.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    let matchesWithAvatars = await Promise.all(
      matches.map(async (match) => {
        const player1Avatar = await Player.findById(match.player1ID);
        const player2Avatar = await Player.findById(match.player2ID);

        return {
          id: match._id,
          type: match.type,
          player1: match.player1,
          player2: match.player2,
          date: match.date,
          time: match.time,
          totalPoints: match.totalPoints,
          status: match.status,
          winner: match.winner,
          score: match.score,
          player1Avatar: player1Avatar ? player1Avatar.profilePic : null,
          player2Avatar: player2Avatar ? player2Avatar.profilePic : null,
        };
      })
    );

    // Sort by date + time descending (JS-side sort)
    matchesWithAvatars.sort((a, b) => {
      const aDateTime = new Date(
        `${a.date.toISOString().split("T")[0]}T${a.time}`
      );
      const bDateTime = new Date(
        `${b.date.toISOString().split("T")[0]}T${b.time}`
      );
      return bDateTime - aDateTime; // descending
    });

    res.status(200).json({ matches: matchesWithAvatars });
  } catch (err) {
    console.error("Error fetching today's matches:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/myMatches", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  try {
    const matches = await Match.find({
      $or: [
        { player1ID: id },
        { player2ID: id },
        { team1PlayersID: { $in: [id] } },
        { team2PlayersID: { $in: [id] } },
      ],
    });

    const matchesWithAvatars = await Promise.all(
      matches.map(async (match) => {
        const player1 = await Player.findById(match.player1ID);
        const player2 = await Player.findById(match.player2ID);

        return {
          id: match._id,
          type: match.type,
          player1: match.player1,
          player2: match.player2,
          date: match.date,
          totalPoints: match.totalPoints,
          score: match.score,
          status: match.status,
          winner: match.winner,
          player1Avatar: player1
            ? player1.avatarUrl || player1.profilePic || null
            : null,
          player2Avatar: player2
            ? player2.avatarUrl || player2.profilePic || null
            : null,
        };
      })
    );

    res.status(200).json({ matches: matchesWithAvatars });
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/score-singles", async (req, res) => {
  const { matchId, score, winner } = req.body;
  console.log("Received data:", req.body);

  if (!matchId || !score || !winner) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.score = score; // e.g., "11-9"
    match.winner = winner; // e.g., "Devarshee"
    match.status = "Completed";

    await match.save();

    return res.json({ message: "Match updated successfully", match });
  } catch (error) {
    console.error("Error updating match:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update status of a match
router.post("/update-status", async (req, res) => {
  const { matchId, status } = req.body;

  if (!matchId || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.status = status;

    await match.save();

    return res.json({ message: "Match status updated successfully", match });
  } catch (error) {
    console.error("Error updating match status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
