const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (email, password) => ipcRenderer.invoke("auth:login", email, password),
    signUp: (email, password) => ipcRenderer.invoke("auth:signup", email, password)
});