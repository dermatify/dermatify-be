const { verify } = require("./authHandlers")
const { saveUser, getUser, getUserData, updateUser } = require("../config/userDB");
const Boom = require("@hapi/boom");

async function updateProfileHandler(request, reply) {
  const token = await verify(request, "ACCESS_TOKEN")
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }
  const userData = await getUserData(token.email);
  return userData
}

module.exports = {
  updateProfileHandler
}
