const express = require("express");
const { getRecommendations } = require("./recommendation_service");

const app = express();
const PORT = 4000;

app.get("/recommend/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const recommendations = await getRecommendations(userId);
    res.json({ recommendations });
  } catch (error) {
    console.error("Error in /recommend/:userId:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Recommendation system running on http://localhost:${PORT}`);
});
