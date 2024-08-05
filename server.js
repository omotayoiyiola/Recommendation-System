// server.js
const express = require("express");
const { getRecommendations } = require("./recommendation_service");

const app = express();
const port = 3000;

app.get("/recommend/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Recommendation system running on http://localhost:${port}`);
});
