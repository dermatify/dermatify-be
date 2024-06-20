require("dotenv").config({
  path: [".env"],
  override: true,
});

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.DB_URL, process.env.DB_KEY);

module.exports = {
  supabase,
};
