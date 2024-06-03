const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");
const { saveUser, getUser } = require("../config/userDB");
const { checkValidEmail, createUserData } = require("../helpers/authHelpers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

  let user = getUser(data.email);

  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const userData = createUserData(
    data.name,
    data.picture,
    refreshToken,
    accessToken,
    null,
    true
  );

  if (!user.exists) {
    saveUser(data.email, userData);
  }

  response = {
    refresh_token: refreshToken,
    access_token: accessToken,
  };

  return response;
}

async function register(request, reply) {
  const salt = await bcrypt.genSalt(10);
  const payload = request.payload;

  const name = payload.name;
  const email = payload.email;
  const password = payload.email;

  if (!name || !email || !password) {
    throw new EmptyFieldError(
      "Name, username, and password are required fields!"
    );
  }
  if (!checkValidEmail(email)) {
    throw new EmailInvalidError("Email is invalid!");
  }

  let user = getUser(email);
  if (user.exists) {
    throw new UserExistsError("User already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, salt);
  saveUser(
    email,
    createUserData(name, null, null, null, hashedPassword, false)
  );

  const response = {
    message: "User created!",
  };

  return response;
}

module.exports = {
  authHandler,
  authCallbackHandler,
  register,
};
