require("dotenv").config({
  path: [".env.dev"],
});
const Hapi = require("@hapi/hapi");
const routes = require("../routes");

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
