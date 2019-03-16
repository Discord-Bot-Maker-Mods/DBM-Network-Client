//--------------------------------------------Modules--------------------------------------------//
var electron = require('electron');
var {autoUpdater} = require("electron-updater");
//var url = require('url');
var path = require('path');
var ejs = require('ejs-electron');
var fs = require('fs');

var {app, BrowserWindow, ipcMain} = electron;
//-----------------------------------------------------------------------------------------------//



//-----------------------------------------Splash Screen-----------------------------------------//
let splashScreen = null;

function SplashScreen() {
    let bounds = electron.screen.getPrimaryDisplay().bounds;
    let x = bounds.x + ((bounds.width - 1020) / 2);
    let y = bounds.y + ((bounds.height - 250) / 2);
    splashScreen = new BrowserWindow({
        'width': 1020,
        'height': 250,
        x: x,
        y: y,
        frame: false,
        title: "DBM Network Client",
        show: false,
        transparent: true,
        movable: false,
        resizable: false,
        icon: path.join(__dirname, "app.ico"),
        webPreferences : {
            nodeIntegration: true
        }
    });
    
    splashScreen.loadFile(path.join(__dirname, "splash", "splash.ejs"));

    splashScreen.on('closed', () => {
        menuScreen = null;
        splashScreen = null;
        app.quit();
    });
};
//-----------------------------------------------------------------------------------------------//



//------------------------------------------Menu Screen------------------------------------------//
let menuScreen = null;

function MenuScreen() {
    menuScreen = new BrowserWindow({
        'minWidth': 1050,
        'minHeight': 650,
        'width': 1050,
        'height': 650,
        title: "DBM Network Client",
        frame: true,
        show: false,
        transparent: false,
        icon: path.join(__dirname, "app.ico"),
        webPreferences : {
            nodeIntegration: true
        }
    });
    
    menuScreen.loadFile(path.join(__dirname, "menu", "menu", "menu.ejs"));

    menuScreen.on('closed', () => {
        menuScreen = null;
        splashScreen = null;
        app.quit();
    });
};
//-----------------------------------------------------------------------------------------------//



//---------------------------------------------Events--------------------------------------------//
app.on('ready', function() {
    SplashScreen();
    MenuScreen();

    splashScreen.once('ready-to-show', () => {
        splashScreen.show();
        setTimeout(() => {
            splashScreen.hide();
            menuScreen.show();
            DiscordRPC();

            autoUpdater.checkForUpdatesAndNotify();
            setInterval(() => {
                autoUpdater.checkForUpdatesAndNotify();
            }, 600000);
        }, 10000);
    });

    //----------------------------------------Electron Updater---------------------------------------//
    function sendStatusToWindow(text) {
        menuScreen.webContents.send('ElectronUpdaterMES', text);
    }

    menuScreen.webContents.on('did-finish-load', () => {
        autoUpdater.on('checking-for-update', () => {
            sendStatusToWindow('Checking for updates...');
        });

        autoUpdater.on('update-not-available', () => {
            sendStatusToWindow('Latest version');
        });

        autoUpdater.on('update-available', () => {
            sendStatusToWindow('Update available');
        });

        autoUpdater.on('download-progress', (progressObj) => {
            sendStatusToWindow(`Downloading update... [${progressObj.percent.toString().split(".")[0]}%]`);
        });

        autoUpdater.on('update-downloaded', (info) => {
            sendStatusToWindow('Update ready!');
        });
    });

    electron.ipcMain.on('asynchronous-message', function (evt, message) {
        if (message === 'quitAndInstall') {
            autoUpdater.quitAndInstall();
        }
    });
    //-----------------------------------------------------------------------------------------------//

});
//-----------------------------------------------------------------------------------------------//



//------------------------------------------Discord RPC------------------------------------------//
var obj = JSON.parse(fs.readFileSync(path.join(app.getPath("userData"), "data", "data.json"), 'utf8'));

function DiscordRPC() {
if(obj.Discord_RPC == true) {
    const DiscordRPC = require('discord-rpc');
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    const startTimestamp = new Date();
    const clientId = '549975074854404097';
    let checkTab = null;

    function setActivity(tab, time){
        rpc.setActivity({
            state: 'Tab: ' + tab,
            startTimestamp: time,
            largeImageKey: 'dbmnc_icon_dark',
            instance: false,
        });    
    }

    ipcMain.on('mode:changed', function(e, changed){
        if(changed !== checkTab) {
            setActivity(changed, new Date());
            checkTab = changed;
        }
    });

    rpc.once('ready', () => {
        setActivity(process.platform === 'win32' ? "Mods" : "Bot", startTimestamp);
    });

    rpc.login({clientId}).catch(console.error);
};
};
//-----------------------------------------------------------------------------------------------//
