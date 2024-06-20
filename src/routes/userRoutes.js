const {
  getArticleHandler,
  updateProfileHandler,
  postPredictHandler,
  getRecentPredictionsHandler,
} = require("../handlers/userHandlers");

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
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        // allow photo with 1MB max
        maxBytes: 1000000,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    path: "/prediction/recents",
    method: "GET",
    handler: getRecentPredictionsHandler,
  },
];
module.exports = user;

