const { supabase } = require("../config/supabase");
const Boom = require("@hapi/boom");

async function getArticleHandler(request, h) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw Boom.internal(
        "Database error occurred while fetching articles: " + error.message
      );
    }

    return h.response({ data }).code(200);
  } catch (error) {
    if (!error.isBoom) {
      error = Boom.internal("An unexpected error occurred: " + error.message);
    }

    return h.response(error.output.payload).code(error.output.statusCode);
  }
}

module.exports = {
  getArticleHandler,
};
