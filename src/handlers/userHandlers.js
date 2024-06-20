require("dotenv").config({
  path: [".env.dev"],
});

const { verify } = require("./authHandlers");
const {
  getUserData,
  updateUser,
  storePrediction,
} = require("../config/userDB");
const { supabase } = require("../config/supabase");
const Boom = require("@hapi/boom");
const crypto = require("crypto");
const axios = require("axios");

async function updateProfileHandler(request, reply) {
  const token = await verify(request, "ACCESS_TOKEN");
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }
  const userData = await getUserData(token.email);

  const payload = request.payload;
  userData.name = payload.name;

  await updateUser(token.email, userData);

  return userData;
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
  const token = await verify(request, "ACCESS_TOKEN");
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }

  const { image } = request.payload;

  if (!image) {
    throw Boom.badRequest("Image is Required");
  }

  try {
    const response = await axios.post(process.env.PREDICT_PATH, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);
    console.log("data", response.data);
    return response.code(200);
  } catch (error) {
    return Boom.internal(error, response);
  }
  console.log("lewat sini ga si");
  // const { confidenceScore } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    confidence_score: confidenceScore,
    createdAt: createdAt,
  };

  // await storeData(id, data);
  await storePrediction(token.email, id, data);

  const result = h.response({
    status: "success",
    message: "Model is predicted successfully.",
    data,
  });
  result.code(201);
  return result;
}

module.exports = {
  getArticleHandler,
  updateProfileHandler,
  postPredictHandler,
};
