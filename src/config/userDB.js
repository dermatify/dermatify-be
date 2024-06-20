const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();
const mainCollection = db.collection("users");

async function saveUser(email, data) {
  await mainCollection.doc(email).set(data);
}

async function getUser(email) {
  const user = await mainCollection.doc(email).get();
  return user;
}

async function getUserData(email) {
  const user = await getUser(email);
  return user.data();
}

async function updateUser(email, data) {
  await mainCollection.doc(email).update(data);
}

async function storePrediction(email, predictionId, predictionData) {
  const userDoc = mainCollection.doc(email);
  const user = await getUserData(email);

  if (!user.predictions) {
    user.predictions = {};
  }

  user.predictions[predictionId] = predictionData;

  await userDoc.update({
    predictions: user.predictions,
  });
}

module.exports = {
  saveUser,
  getUser,
  getUserData,
  updateUser,
  storePrediction,
};
