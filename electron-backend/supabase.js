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
    const workerResult = await createNewWorkerEntry(data.user.id, first_name, middle_name, last_name, email);
    
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

async function createNewWorkerEntry(auth_id, first_name, middle_name, last_name, email) {
  const { data, error } = await supabase.from('TBL_WORKER').insert([
    {
      auth_id,
      first_name,
      middle_name,
      last_name,
      email
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
    .select("employee_id, first_name, middle_name, last_name")
    .eq("auth_id", userId)
    .single();

  if (error || !data) return { success: false, error: error };
  if (data) {
    // get current login worker all roles
    const role_data = await getAllWorkerRoles(data.employee_id);
    console.log(role_data)
    if (role_data) {
      return { success: true, worker: data, worker_roles: role_data };
    } else {
      return { success: false, error: error }
    }
  }

}

async function getAllProducts() {
 const { data, error } = await supabase
    .from("TBL_PRODUCT_ENTRY")
    .select(`
      entry_id,
      added_at,
      expiration_date,
      purchased_date,
      TBL_PRODUCT_ITEM (
        item_name,
        price,
        barcode,
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

async function addNewProductItem(item_name,barcode, weight, category, price) {
  const { data, error } = await supabase.from('TBL_PRODUCT_ITEM').insert([
    {
      item_name,
      barcode,
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

async function addNewProductEntry(item_id, expiration_date, purchased_date) {
  const { data, error } = await supabase.from('TBL_PRODUCT_ENTRY').insert([
    {
      item_id,
      expiration_date,
      purchased_date,
    }
  ]);
  if (error) {
    return {success: false, error: error};
  }
  return {success: true};
}

async function getAllWorkers() {
  const { data, error } = await supabase
    .from('TBL_WORKER')
    .select('*');
  
  if (error) throw error;
  return data;
}

async function getAllWorkerRoles(employee_id) {
  const { data, error } = await supabase
    .from('TBL_WORKER_ROLE')
    .select('TBL_ROLE (id, role_name)').eq("employee_id", employee_id);
  
  if (error) throw error;
  return data;
}

async function getAllRoles() {
  const { data, error } = await supabase
    .from('TBL_ROLE')
    .select('*');
  
  if (error) throw error;
  return data;
}

async function assignEmployeeRole(role_id, employee_id) {
  const { data, error } = await supabase
    .from('TBL_WORKER_ROLE')
    .insert([{ role_id, employee_id }]);
  
  if (error) throw error;
  return {success: true};
}

async function unassignEmployeeRole(role_id, employee_id) {
  const { data, error } = await supabase
    .from('TBL_WORKER_ROLE')
    .delete()
    .match({ role_id, employee_id });
  
  if (error) throw error;
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
    getAllWorkers,
    getAllWorkerRoles,
    getAllRoles,
    assignEmployeeRole,
    unassignEmployeeRole,
};
