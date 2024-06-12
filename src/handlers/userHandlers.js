const { verify } = require("./authHandlers")
const { getUserData, updateUser } = require("../config/userDB");
const Boom = require("@hapi/boom");

async function updateProfileHandler(request, reply) {
  const token = await verify(request, "ACCESS_TOKEN")
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }
  const userData = await getUserData(token.email);

  const payload = request.payload
  userData.name = payload.name

  await updateUser(token.email, userData)

  return userData
}

module.exports = {
  updateProfileHandler
}
