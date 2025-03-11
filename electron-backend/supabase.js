require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user };
}

async function signUp(email, password, first_name, middle_name, last_name) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.log("→ Auth error:", error.message);
        return { success: false, message: error.message };
    }
    const workerResult = await createNewWorkerEntry(data.user.id, first_name, middle_name, last_name);
    
    if (workerResult.error) {
        return { success: false, message: "User created, but worker insert failed: " + workerResult.error };
    }
    return { success: true, user: data.user };
}

async function createNewWorkerEntry(user_id, first_name, middle_name, last_name) {
  const { data, error } = await supabase.from('TBL_WORKER').insert([
    {
      user_id,
      first_name,
      middle_name,
      last_name
    }
  ]);

  if (error) return { error };
  return { success: true, data };
}
module.exports = { login, signUp };
