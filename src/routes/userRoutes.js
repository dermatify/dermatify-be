const { getArticleHandler } = require("../handlers/userHandlers");

const user = [
  {
    method: "GET",
    path: "/articles",
    handler: getArticleHandler,
  },
];
module.exports = user;
