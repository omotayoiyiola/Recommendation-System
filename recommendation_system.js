// recommendation_system.js
const { trainModel } = require("./recommendation_model");
const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.log("Redis client error:", err);
});

async function main() {
  const { model, userIds, productIds } = await trainModel();

  client.set("userIds", JSON.stringify(userIds));
  client.set("productIds", JSON.stringify(productIds));

  model.save("file://./model");

  console.log("Model training completed and saved.");
}

main();
