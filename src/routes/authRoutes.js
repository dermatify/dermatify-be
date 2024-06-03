const { authHandler, authCallbackHandler, register } = require("../handlers/authHandlers");

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
  }
];

module.exports = auth;
