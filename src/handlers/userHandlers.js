require("dotenv").config({
  path: [".env"],
  override: true,
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
const FormData = require("form-data");

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
    const { data, error } = await supabase.from("articles").select("*");
    if (error) {
      throw new Error("Database error: " + error.message);
    }

    return h.response({ data }).code(200);
  } catch (error) {
    return Boom.internal("An unexpected error occurred: " + error.message);
  }
}

async function getRecentPredictionsHandler(request, h) {
  const token = await verify(request, "ACCESS_TOKEN");
  if (!token) {
    throw Boom.unauthorized("Invalid token!");
  }
  const predictions = await getPredictions(token.email);

  return predictions;
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

  let imageBuffer;
  let contentType;
  if (typeof image === "string" && image.startsWith("data:image")) {
    // Handle base64 encoded image
    const [typeInfo, base64Image] = image.split(";base64,");
    contentType = typeInfo.split(":")[1];
    imageBuffer = Buffer.from(base64Image, "base64");
  } else if (Buffer.isBuffer(image)) {
    // Handle buffer image
    imageBuffer = image;
    contentType = "application/octet-stream"; // Default content type for buffer, should be updated accordingly
  } else {
    throw Boom.badRequest("Invalid image format");
  }
  const formData = new FormData();
  formData.append("image", imageBuffer, {
    filename: "image",
    contentType: contentType,
  });

  try {
    const response = await axios.post(process.env.PREDICT_PATH, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const responseData = response.data;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      createdAt: createdAt,
      issue: responseData.issue,
      score: responseData.score,
    };

    await storePrediction(token.email, id, data);

    const result = h.response({
      status: "success",
      message: "Model predicted successfully.",
      data,
    });
    result.code(201);
    return result;
  } catch (error) {
    return Boom.internal(
      "An unexpected error occurred during prediction",
      error
    );
  }
}

module.exports = {
  getArticleHandler,
  updateProfileHandler,
  postPredictHandler,
  getRecentPredictionsHandler,
};
