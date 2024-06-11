const { updateProfileHandler } = require("../handlers/userHandlers");

const userRoutes = [
  {
    path: "/user/profile",
    method: "PUT",
    handler: updateProfileHandler,
  },
];

module.exports = userRoutes;
