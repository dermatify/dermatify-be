const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();
const mainCollection = db.collection("users");

module.exports = {
  mainCollection,
};
