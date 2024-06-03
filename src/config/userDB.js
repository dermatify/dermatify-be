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

module.exports = {
  saveUser,
  getUser,
};
