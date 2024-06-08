const { supabase } = require("../config/supabase");

async function getArticleHandler(request, h) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return h.response({ status: "error", message: error.message }).code(500);
    }

    return h.response({ status: "success", data }).code(200);
  } catch (error) {
    return h.response({ status: "error", message: error.message }).code(500);
  }
}

module.exports = {
  getArticleHandler,
};
