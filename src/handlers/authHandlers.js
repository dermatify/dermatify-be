const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");
const { mainCollection } = require("../config/userDB");

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
  };

  if (!user.exists) {
    await mainCollection.doc(data.id).set(userData);
    return "User created!";
  } else {
    return "Dummy tokens";
  }
}

module.exports = {
  authHandler,
  authCallbackHandler,
};
