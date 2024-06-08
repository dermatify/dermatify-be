const { getArticleHandler } = require("../handlers/userHandlers");

const user = [
  {
    method: "GET",
    path: "/article",
    handler: getArticleHandler,
  },
];
module.exports = user;
