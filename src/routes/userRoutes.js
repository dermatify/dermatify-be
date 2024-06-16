const { getArticleHandler, updateProfileHandler } = require("../handlers/userHandlers");

const user = [
  {
    method: "GET",
    path: "/articles",
    handler: getArticleHandler,
  },
  {
    path: "/user/profile",
    method: "PUT",
    handler: updateProfileHandler,
  },
];
module.exports = user;