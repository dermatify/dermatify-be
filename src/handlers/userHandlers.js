const { supabase } = require("../config/supabase");
const Boom = require("@hapi/boom");

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

module.exports = {
  getArticleHandler,
};
