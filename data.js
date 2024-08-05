// data.js
const dfd = require("danfojs-node");

async function loadData() {
  const data = await dfd.readCSV("data.csv");
  const userIds = data["userId"].unique().values;
  const productIds = data["productId"].unique().values;

  // Convert userId and productId to integers for TensorFlow
  data["userId"] = data["userId"].map((userId) => userIds.indexOf(userId));
  data["productId"] = data["productId"].map((productId) =>
    productIds.indexOf(productId)
  );

  return { data, userIds, productIds };
}

module.exports = { loadData };
