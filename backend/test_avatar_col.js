const path = require('path');
const fs = require('fs');

// Resolve path to backend .env
let envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  envPath = path.resolve(__dirname, '../../../../backend/.env');
}
require('dotenv').config({ path: envPath });

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAvatar() {
  const { data, error } = await supabase
    .from('users')
    .select('avatar')
    .limit(1);

  if (error) {
    console.log('❌ Error: The avatar column does NOT exist in the database yet. Details:', error.message);
  } else {
    console.log('✅ Success: The avatar column exists in the database!');
  }
}

checkAvatar();
