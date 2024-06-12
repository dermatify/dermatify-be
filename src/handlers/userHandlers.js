const { verify } = require("./authHandlers")
const Boom = require("@hapi/boom");

async function updateProfileHandler(request, reply) {
  const token = await verify(request, "ACCESS_TOKEN")
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }
  return "MANTAP"
}

module.exports = {
  updateProfileHandler
}
