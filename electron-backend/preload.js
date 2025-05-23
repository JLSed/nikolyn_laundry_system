const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (email, password) => ipcRenderer.invoke("auth:login", email, password),
    signUp: (email, password, first_name, middle_name, last_name) => ipcRenderer.invoke("auth:signup", email, password, first_name, middle_name, last_name),
    signOut: () => ipcRenderer.invoke("auth:signout"),
    getCurrentWorker: () => ipcRenderer.invoke("request:current_worker"),
    getAllProducts: () => ipcRenderer.invoke("request:all_products"),
    getProductCategories: () => ipcRenderer.invoke("request:product_categories"),
    addNewProductItem: (name, barcode, weight, category, price) => ipcRenderer.invoke("add:product_item", name, barcode, weight, category, price),
    getProductItems: () => ipcRenderer.invoke("request:product_items"),
    addNewProductEntry: (item_id, expiration_date, purchased_date) => ipcRenderer.invoke("add:product_entry", item_id, expiration_date, purchased_date),
    getAllWorkers: () => ipcRenderer.invoke("request:all_workers"),
    getAllWorkerRoles: (worker_id) => ipcRenderer.invoke("request:all_worker_roles", worker_id),
    getAllRoles: () => ipcRenderer.invoke("request:all_roles"),
    assignEmployeeRole: (role_id, worker_id) => ipcRenderer.invoke("add:employee_role", role_id, worker_id),
    unassignEmployeeRole: (role_id, worker_id) => ipcRenderer.invoke("remove:employee_role", role_id, worker_id),
});
