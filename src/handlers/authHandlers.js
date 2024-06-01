const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");
const { mainCollection } = require("../config/userDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function authHandler(request, reply) {
  return reply.redirect(authorizationURL);
}

async function authCallbackHandler(request, reply) {
  const { code } = request.query;
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  let user = await mainCollection.doc(data.id).get();

  var userData = {
    email: data.email,
    name: data.name,
    picture: data.picture,
  };

  if (!user.exists) {
    await mainCollection.doc(data.id).set(userData);
    return "User created!";
  }

  payload = {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
  };

  const refresh_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  response = {
    refresh_token: refresh_token,
    access_token: access_token,
  };

  return response;

  return token;
}

module.exports = {
  authHandler,
  authCallbackHandler,
};
