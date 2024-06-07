const { postPredictHandler } = require("../handlers/authHandlers");
const userRoutes = [
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

module.exports = userRoutes;
