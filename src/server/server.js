require("dotenv").config({
  path: [".env.dev"],
});
const Hapi = require("@hapi/hapi");
const routes = require("../routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `${response.message} Silakan gunakan foto lain.`,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    if (response.statusCode == 400) {
      const newResponse = h.response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.statusCode == 413) {
      const newResponse = h.response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
