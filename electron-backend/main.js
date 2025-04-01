const { app, BrowserWindow, ipcMain } = require('electron')
const { signUp,
    signOut ,
    login,
    getCurrentWorker,
    getAllProducts,
    getProductCategories,
    addNewProductItem,
    getProductItems,
    addNewProductEntry,
} = require('./supabase.js')
const path = require('path');

// listens to login button in login.html
ipcMain.handle("auth:login", async (_, email, password) => {
    return result = await login(email, password);
});

// listens to signup button in signup.html
ipcMain.handle("auth:signup", async (_, email, password, first_name, middle_name, last_name) => {
    return result = await signUp(email, password, first_name, middle_name, last_name);
});

// listens to clock out button in pos.html
ipcMain.handle("auth:signout", async () => {
    return result = await signOut();
});

// listens to clock out button in pos.html
ipcMain.handle("request:current_worker", async () => {
    return result = await getCurrentWorker();
});

// listens to inventory.html when loaded
ipcMain.handle("request:all_products", async () => {
    return await getAllProducts();
});

ipcMain.handle("add:product_item", async (_, name, weight, category, price) => {
    return await addNewProductItem(name, weight, category, price);
});

//listens to the add new product in inventory when clicked
ipcMain.handle("request:product_categories", async () => {
    return result = await getProductCategories();
})

ipcMain.handle("request:product_items", async () => {
    return await getProductItems();
});

ipcMain.handle("add:product_entry", async (_, item_id, expiration_date, purchased_date, barcode) => {
    return result = await addNewProductEntry(item_id, expiration_date, purchased_date, barcode);
})


let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Nikolyn Laundry Shop System',
        width: 1200,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../electron-frontend/html/pos.html'))
}











app.whenReady().then(() => {
    createMainWindow();
    // remove main window from memory on close
    mainWindow.on('closed', () => (mainWindow = null))
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

});

// kill process when window is closed in os other than Mac
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
