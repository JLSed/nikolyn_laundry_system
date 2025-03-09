const { app, BrowserWindow, ipcMain } = require('electron')
const { signUp, login} = require('./supabase.js')
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

    mainWindow.loadFile(path.join(__dirname, '../electron-frontend/login.html'))
}

// qwerty1234567890
// listens to login button in login.html
ipcMain.handle("auth:login", async (_, email, password) => {
    const response = await login(email, password);
    // switch html to pos when login is success
    if (response.success) {
        mainWindow.loadFile(path.join(__dirname, '../electron-frontend/pos.html'));
    }
    return response;
});

// listens to signup button in login.html
ipcMain.handle("auth:signup", async (_, email, password) => {
    return await signUp(email, password);
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