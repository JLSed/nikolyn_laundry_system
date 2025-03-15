const { app, BrowserWindow, ipcMain } = require('electron')
const { signUp, signOut , login, getCurrentWorker} = require('./supabase.js')
const path = require('path');


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

// listens to login button in login.html
ipcMain.handle("auth:login", async (_, email, password) => {
    return response = await login(email, password);
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
