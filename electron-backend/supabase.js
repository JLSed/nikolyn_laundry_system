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

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user };
}

module.exports = { login, signUp };
