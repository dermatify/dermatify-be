const { verify } = require("./authHandlers")
const { getUserData, updateUser } = require("../config/userDB");
const { supabase } = require("../config/supabase");
const Boom = require("@hapi/boom");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");


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

async function getArticleHandler(request, h) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw new Error("Database error: " + error.message);
    }

    return h.response({ data }).code(200);
  } catch (error) {
    return Boom.internal("An unexpected error occurred: " + error.message);
  }
}
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { confidenceScore } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    confidence_score: confidenceScore,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully.",
    data,
  });
  response.code(201);
  return response;
}

module.exports = {
  getArticleHandler,
  updateProfileHandler,
  postPredictHandler,
};


