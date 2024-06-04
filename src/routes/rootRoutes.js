const rootHandler = require("../handlers/root");

const rootRoutes = [
  {
    path: "/",
    method: "GET",
    handler: rootHandler,
  },
];

module.exports = rootRoutes;
