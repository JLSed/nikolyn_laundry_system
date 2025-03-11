const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (email, password) => ipcRenderer.invoke("auth:login", email, password),
    signUp: (email, password, first_name, middle_name, last_name) => ipcRenderer.invoke("auth:signup", email, password, first_name, middle_name, last_name)
});