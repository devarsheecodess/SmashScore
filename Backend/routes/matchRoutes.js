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
      date: new Date(),
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
    const before24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // -24 hours
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

    const matches = await Match.find({
      date: {
        $gte: before24Hours,
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
    looser.stats.totalpoints += looserPoints;
    winnerr.stats.totalpoints += winnerPoints;
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
    match.margin = Math.abs(winnerPoints - looserPoints);

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

router.post("/bestMatch", async (req, res) => {
  const playerId = req.body.playerId;

  if (!playerId) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  try {
    const playerDoc = await Player.findById(playerId).select("name").lean();

    if (!playerDoc) {
      return res.status(404).json({ message: "Player not found" });
    }

    const playerName = playerDoc.name;

    // Get all matches where this player was the winner
    const matchesWon = await Match.find({ winner: playerName }).lean();

    if (!matchesWon.length) {
      return res
        .status(200)
        .json({ message: "No matches won by this player." });
    }

    // Sort matches in descending order by margin
    matchesWon.sort((a, b) => {
      const marginA = parseFloat(a.margin) || 0;
      const marginB = parseFloat(b.margin) || 0;
      return marginB - marginA; // Sort by margin in descending order
    });

    // Get the match with the highest margin
    const bestMatch = matchesWon[0];
    res.status(200).json({
      opponent:
        bestMatch.player1 === playerName
          ? bestMatch.player2
          : bestMatch.player1,
      score: bestMatch.score,
    });
  } catch (error) {
    console.error("Error fetching best match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Rank the players based on their scores
router.get("/rankings", async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ "stats.totalpoints": -1 })
      .lean();

    if (!players.length) {
      return res.status(404).json({ message: "No players found" });
    }

    const rankings = players.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      avatar: player.profilePic,
      totalPoints: player.stats.totalpoints,
    }));

    res.status(200).json({ rankings });
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch rank of a specific player
router.post("/rank", async (req, res) => {
  const playerId = req.body.id;

  if (!playerId) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  try {
    const player = await Player.findById(playerId).select("stats").lean();

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const allPlayers = await Player.find()
      .sort({ "stats.totalpoints": -1 })
      .lean();
    const rank = allPlayers.findIndex((p) => p._id.toString() === playerId) + 1;

    res.status(200).json({ rank });
  } catch (error) {
    console.error("Error fetching player rank:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
