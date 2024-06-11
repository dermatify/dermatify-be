const { updateProfileHandler } = require("../handlers/userHandlers");

const userRoutes = [
  {
    path: "/",
    method: "PUT",
    handler: updateProfileHandler,
  },
];

module.exports = userRoutes;
