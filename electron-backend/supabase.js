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

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
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

async function getCurrentWorker() {
  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;
  if (!userId) return { success: false };

  const { data, error } = await supabase
    .from("TBL_WORKER")
    .select("first_name, middle_name, last_name")
    .eq("user_id", userId)
    .single();

  if (error || !data) return { success: false };

  return { success: true, worker: data };
}

async function getAllProducts() {
 const { data, error } = await supabase
    .from("TBL_PRODUCT_ENTRY")
    .select(`
      entry_id,
      added_at,
      barcode,
      expiration_date,
      purchased_date,
      TBL_PRODUCT_ITEM (
        item_name,
        price,
        category,
        weight
      )
    `);

  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return data;
}

async function getProductCategories() {
    const {data , error} = await supabase
        .from("TBL_PRODUCT_ITEM")
        .select("category", {distinct: true});
    if (error) {
        console.error("Error fetching category: " , error);
        return [];
    }
    return data;
}

async function addNewProductItem(item_name, weight, category, price) {
  const { data, error } = await supabase.from('TBL_PRODUCT_ITEM').insert([
    {
      item_name,
      category,
      price,
      weight
    }
  ]);

  if (error) return { success: false, error: error };
  return { success: true, data };
}

async function getProductItems() {
    const { data, error } = await supabase.from('TBL_PRODUCT_ITEM').select("item_name, weight, item_id");
    if (error) {
        console.error("Error fetching : " , error);
        return { success: false, error: error };
    }
    return { success: true, data };
}

async function addNewProductEntry(item_id, expiration_date, purchased_date, barcode) {
  const { data, error } = await supabase.from('TBL_PRODUCT_ENTRY').insert([
    {
      item_id,
      expiration_date,
      purchased_date,
      barcode
    }
  ]);
  if (error) {
    return {success: false, error: error};
  }
  return {success: true};
}

module.exports = { 
    login,
    signUp,
    signOut,
    getCurrentWorker,
    getAllProducts,
    getProductCategories,
    addNewProductItem,
    getProductItems,
    addNewProductEntry,
};
