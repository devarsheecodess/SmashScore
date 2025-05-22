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
    const now = new Date(); // current time
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

    const matches = await Match.find({
      date: {
        $gte: now,
        $lt: next24Hours,
      },
    });

    const matchesWithAvatars = await Promise.all(
      matches.map(async (match) => {
        const [player1, player2] = await Promise.all([
          Player.findById(match.player1ID).lean(),
          Player.findById(match.player2ID).lean(),
        ]);

        return {
          id: match._id,
          type: match.type,
          player1: match.player1,
          player2: match.player2,
          player1ID: match.player1ID,
          player2ID: match.player2ID,
          date: match.date,
          time: match.time,
          totalPoints: match.totalPoints,
          status: match.status,
          winner: match.winner,
          score: match.score,
          player1Avatar: player1?.profilePic || null,
          player2Avatar: player2?.profilePic || null,
        };
      })
    );

    // Sort matches by date + time (ascending)
    matchesWithAvatars.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return aTime - bTime;
    });

    res.status(200).json({ matches: matchesWithAvatars });
  } catch (err) {
    console.error("Error fetching upcoming matches:", err.message, err.stack);
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
    }).sort({ date: -1 }); // Sort by date descending

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
  const {
    matchId,
    looserID,
    winnerID,
    looserPoints,
    winnerPoints,
    score,
    winner,
  } = req.body;

  if (!matchId || !score || !winner) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const looser = await Player.findById(looserID);
    const winnerr = await Player.findById(winnerID);

    if (!looser || !winnerr) {
      return res.status(404).json({ message: "Player(s) not found" });
    }

    // Update stats
    looser.stats.losses += 1;
    winnerr.stats.wins += 1;
    looser.stats.points += looserPoints;
    winnerr.stats.points += winnerPoints;
    looser.stats.singles += 1;
    winnerr.stats.singles += 1;

    // Save updated players
    await looser.save();
    await winnerr.save();

    // Update match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.score = score;
    match.winner = winner;
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
