const supabase = require("./supabaseClient");

const connectDB = async () => {
  try {
    const { data, error } = await supabase.from("campaigns").select("id").limit(1);
    if (error) throw error;
    console.log("Supabase Database Connected successfully!");
  } catch (err) {
    console.error("❌ Supabase Connection Check Failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
