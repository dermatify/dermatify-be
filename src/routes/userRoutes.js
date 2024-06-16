const { getArticleHandler, updateProfileHandler, postPredictHandler } = require("../handlers/userHandlers");

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
];
module.exports = user;