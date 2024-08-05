// recommendation_service.js
const tf = require("@tensorflow/tfjs-node");
const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.log("Redis client error:", err);
});

async function loadModel() {
  return await tf.loadLayersModel("file://./model/model.json");
}

async function getRecommendations(userId) {
  const model = await loadModel();
  const userIds = JSON.parse(await client.getAsync("userIds"));
  const productIds = JSON.parse(await client.getAsync("productIds"));

  const userIndex = userIds.indexOf(userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const input = tf.tensor1d([userIndex], "int32");
  const predictions = model.predict(input).dataSync();

  const recommendedProducts = productIds.filter(
    (_, index) => predictions[index] > 0.1
  );
  return recommendedProducts;
}

module.exports = { getRecommendations };
