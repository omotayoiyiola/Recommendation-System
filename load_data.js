const redis = require("redis");
const fs = require("fs");
const client = redis.createClient();

client.on("error", (err) => {
  console.log("Redis client error:", err);
});

client.on("connect", async () => {
  console.log("Connected to Redis");

  try {
    const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    await client.set("userIds", JSON.stringify(data.userIds));
    await client.set("productIds", JSON.stringify(data.productIds));
    console.log("Data loaded into Redis");
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    client.quit();
  }
});

client.connect();
