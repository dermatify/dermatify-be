const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const { google } = require("googleapis");
const { oauth2Client, authorizationURL } = require("./oauth");

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/auth/google",
    handler: (request, reply) => {
      return reply.redirect(authorizationURL);
    },
  });

  server.route({
    method: "GET",
    path: "/auth/google/callback",
    handler: async (request, reply) => {
      const { code } = request.query;
      const { tokens } = await oauth2Client.getToken(code);

      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data } = oauth2.userinfo.get();

      var response = {
        data: data,
      };

      return response;
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
