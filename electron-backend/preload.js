const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (email, password) => ipcRenderer.invoke("auth:login", email, password),
    signUp: (email, password, first_name, middle_name, last_name) => ipcRenderer.invoke("auth:signup", email, password, first_name, middle_name, last_name),
    signOut: () => ipcRenderer.invoke("auth:signout"),
    getCurrentWorker: () => ipcRenderer.invoke("request:current_worker"),
    getAllProducts: () => ipcRenderer.invoke("request:all_products"),
    getProductCategories: () => ipcRenderer.invoke("request:product_categories"),
    addNewProductItem: (name, weight, category, price) => ipcRenderer.invoke("add:product_item", name, weight, category, price),
    getProductItems: () => ipcRenderer.invoke("request:product_items"),
    addNewProductEntry: (item_id, expiration_date, purchased_date, barcode) => ipcRenderer.invoke("add:product_entry", item_id, expiration_date, purchased_date, barcode),
});
