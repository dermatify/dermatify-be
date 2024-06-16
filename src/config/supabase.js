require("dotenv").config({
  path: [".env.dev"],
});

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.DB_URL, process.env.DB_KEY);

module.exports = {
  supabase,
};
