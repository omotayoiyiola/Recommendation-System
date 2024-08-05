// recommendation_model.js
const tf = require("@tensorflow/tfjs-node");
const { loadData } = require("./data");

async function createModel(numUsers, numProducts) {
  const model = tf.sequential();

  model.add(
    tf.layers.embedding({
      inputDim: numUsers,
      outputDim: 50,
      inputLength: 1,
    })
  );
  model.add(tf.layers.flatten());

  model.add(
    tf.layers.dense({
      units: numProducts,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: "adam",
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

async function trainModel() {
  const { data, userIds, productIds } = await loadData();
  const numUsers = userIds.length;
  const numProducts = productIds.length;

  const model = await createModel(numUsers, numProducts);

  const xs = tf.tensor1d(data["userId"].values, "int32");
  const ys = tf.tensor1d(data["productId"].values, "int32");

  await model.fit(xs, ys, {
    epochs: 50,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
      },
    },
  });

  return { model, userIds, productIds };
}

module.exports = { trainModel };
