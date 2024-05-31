const { authHandler, authCallbackHandler } = require("../handlers/authHandlers");

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
];

module.exports = auth;
