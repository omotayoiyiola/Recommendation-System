const tf = require("@tensorflow/tfjs-node");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

client.on("error", (err) => {
  console.log("Redis client error:", err);
});

async function loadModel() {
  return await tf.loadLayersModel("file://./model.json");
}

async function getRecommendations(userId) {
  try {
    const model = await loadModel();
    const userIdsStr = await getAsync("userIds");
    const productIdsStr = await getAsync("productIds");

    if (!userIdsStr || !productIdsStr) {
      throw new Error("Missing data in Redis");
    }

    const userIds = JSON.parse(userIdsStr);
    const productIds = JSON.parse(productIdsStr);

    console.log("userIds:", userIds);
    console.log("productIds:", productIds);

    const userIndex = userIds.indexOf(userId.toString());
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const input = tf.tensor1d([userIndex], "int32");
    const predictions = model.predict(input).dataSync();

    const recommendedProducts = productIds.filter(
      (_, index) => predictions[index] > 0.1
    );
    return recommendedProducts;
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    throw error;
  }
}

module.exports = { getRecommendations };
