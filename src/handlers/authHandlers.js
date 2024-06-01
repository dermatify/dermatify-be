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

  const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  var userData = {
    ...data,
    refresh_token: refresh_token,
    access_token: access_token,
    is_active: true,
  };

  if (!user.exists) {
    await mainCollection.doc(data.id).set(userData);
  }

  response = {
    refresh_token: refresh_token,
    access_token: access_token,
  };

  return response;
}

function renew(request, reply) {
  const headers = request.headers;
}

module.exports = {
  authHandler,
  authCallbackHandler,
};
