const { authHandler, authCallbackHandler, register, login } = require("../handlers/authHandlers");

const auth = [
  {
    method: "GET",
    path: "/auth/google",
    handler: authHandler,
  },
  {
    method: "GET",
    path: "/auth/google/callback",
    handler: authCallbackHandler,
  },
  {
    method: "POST",
    path: "/auth/register",
    handler: register
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: login
  }
];

module.exports = auth;
