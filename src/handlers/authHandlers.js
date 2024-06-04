const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");
const { saveUser, getUser, updateUser } = require("../config/userDB");
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

  const refreshToken = jwt.sign(
    { email: data.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const accessToken = jwt.sign(
    { email: data.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

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
  const password = payload.password;

  if (!name || !email || !password) {
    throw new Error("Name, username, and password are required fields!");
  }
  if (!checkValidEmail(email)) {
    throw new Error("Email is invalid!");
  }

  let user = await getUser(email);

  if (user.exists) {
    throw new Error("User already exists!");
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

async function login(request, reply) {
  const payload = request.payload;

  const email = payload.email;
  const password = payload.password;

  const user = await getUser(email);
  var userData = user.data();

  if (!user.exists) {
    throw new Error("User not found!");
  }

  const isValid = await bcrypt.compare(password, userData.hashedPassword);
  if (!isValid) {
    throw new Error("Invalid credentials!");
  }

  const refreshToken = jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const accessToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  userData.refreshToken = refreshToken;
  userData.accessToken = accessToken;
  userData.isActive = true;

  await updateUser(email, userData);

  const response = {
    refresh_token: refreshToken,
    access_token: accessToken,
  };

  return response;
}

module.exports = {
  authHandler,
  authCallbackHandler,
  register,
  login,
};
