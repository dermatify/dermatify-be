const { verify } = require("./authHandlers")
const Boom = require("@hapi/boom");

async function updateProfileHandler(request, reply) {
  if (!await verify(request)) {
    throw Boom.unauthorized("Invalid token!");
  }
  return "MANTAP"
}

module.exports = {
  updateProfileHandler
}
