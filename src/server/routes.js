const rootHandler = require("../server/handler");

const routes = [
  {
    path: "/",
    method: "GET",
    handler: rootHandler,
  },
];

module.exports = routes;
