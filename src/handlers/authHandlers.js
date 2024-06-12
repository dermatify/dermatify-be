const { google } = require("googleapis");
const { authorizationURL, oauth2Client } = require("../config/oauth");
const { saveUser, getUser, getUserData, updateUser } = require("../config/userDB");
const { checkValidEmail, createUserData } = require("../helpers/authHelpers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Boom = require("@hapi/boom");

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
    refreshToken: refreshToken,
    accessToken: accessToken,
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
    throw Boom.badRequest("Name, username, and password are required fields!");
  }
  if (!checkValidEmail(email)) {
    throw Boom.badRequest("Email is invalid!");
  }

  let user = await getUser(email);

  if (user.exists) {
    throw Boom.badRequest("User already exists!");
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

  var user = await getUser(email)
  var userData = await getUserData(email);

  if (!user.exists) {
    throw Boom.badRequest("User not found!");
  }

  const isValid = await bcrypt.compare(password, userData.hashedPassword);
  if (!isValid) {
    throw Boom.unauthorized("Invalid credentials!");
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
    refreshToken: refreshToken,
    accessToken: accessToken,
  };

  return response;
}

async function logout(request, reply) {
  const accessToken = request.headers["authorization"].split(" ")[1];
  const decodedToken = await verify(request, "ACCESS_TOKEN")
  if (!decodedToken) {
    throw Boom.unauthorized("Invalid token!");
  }
  var user = await getUser(decodedToken.email)
  var userData = await getUserData(decodedToken.email)

  if (!user.exists) {
    throw Boom.badRequest("User not found!");
  }
  if (userData.accessToken != accessToken) {
    throw Boom.unauthorized("Invalid token!");
  }

  userData.refreshToken = null;
  userData.accessToken = null;
  userData.isActive = false;

  await updateUser(decodedToken.email, userData);

  const response = {
    message: "User logged out!",
  };

  return response;
}

async function renew(request, reply) {
  const refreshToken = request.headers["authorization"].split(" ")[1];
  const decodedToken = await verify(request, "REFRESH_TOKEN")
  if (!decodedToken) {
    throw Boom.unauthorized("Invalid token!");
  }
  var email = decodedToken.email
  var user = await getUser(email)
  var userData = await getUserData(email)

  if (!user.exists) {
    throw Boom.badRequest("User not found!");
  }
  if (userData.refreshToken != refreshToken) {
    throw Boom.unauthorized("Invalid token!");
  }

  const newAccessToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  userData.accessToken = newAccessToken;

  await updateUser(email, userData);

  const response = {
    message: "Access token updated!",
    accessToken: newAccessToken,
  };

  return response;
}

async function verify(request, type) {
  const headers = request.headers;
  const token = headers["authorization"].split(" ")[1];

  try {
    if (type == "ACCESS_TOKEN") {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      var userData = await getUserData(decodedToken.email)

      if (userData.accessToken == token) {
        return decodedToken
      }
    } else if (type == "REFRESH_TOKEN") {
      const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      var userData = await getUserData(decodedToken.email)

      if (userData.refreshToken == token) {
        return decodedToken
      }
    }
  } catch (error) {
    return "";
  }
}

module.exports = {
  authHandler,
  authCallbackHandler,
  register,
  login,
  logout,
  renew,
  verify,
};
