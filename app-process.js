/* global __dirname */

// main/app-process.js
const { BrowserWindow, app } = require("electron");
const path = require("path");

const envVariables = require('../env-variables');

const window_setting = {
//    titleBarStyle: 'hidden',
    show: false,
    autoHideMenuBar: true,
    frame: false,
//    kiosk: true,
//    resizable: false,
    title: "Login Page",
    icon: path.join(__dirname, '../assets/images/app_icon.png'),
    webPreferences: {
        devTools: envVariables.isDev === 1 ? true : false,
        contextIsolation: true,
        nodeIntegration: true,
        plugins: true
    }
};

var mainWindow = null;
let lastFocusedWindow = null;


async function createAppWindow() {
    console.log(path.join(__dirname, "preload/preload.js"));
    window_setting.webPreferences.preload = path.join(__dirname, "preload/preload.js");
    mainWindow = new BrowserWindow(window_setting);
    mainWindow.setContentProtection(true);
    mainWindow.loadURL(envVariables.domain);
    mainWindow.once('ready-to-show', async () => {
        mainWindow.show();
    });


    if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
    }

    mainWindow.on("focus", () => {
        lastFocusedWindow = mainWindow;
    });

    mainWindow.on('closed', function () {
        mainWindow = null;

        if (lastFocusedWindow === mainWindow) {
            lastFocusedWindow = null;
        }
    });
}

// Ensure only a single instance runs
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (lastFocusedWindow) {
            if (lastFocusedWindow.isMinimized()) {
                lastFocusedWindow.restore();
            }
            lastFocusedWindow.focus();
        }
    });
}


module.exports = {
    createAppWindow
};