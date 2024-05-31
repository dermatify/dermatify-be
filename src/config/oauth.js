require("dotenv").config({
  path: [".env.dev"],
});

const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_AUTH_CALLBACK_URL,
);

const scopes = [
  process.env.GOOGLE_APIS_EMAIL,
  process.env.GOOGLE_APIS_PROFILE,
];

const authorizationURL = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

module.exports = {
  oauth2Client,
  scopes,
  authorizationURL,
};
