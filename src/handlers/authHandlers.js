const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");

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

  var response = {
    data: data,
  };

  return response;
}

module.exports = {
  authHandler,
  authCallbackHandler,
};
