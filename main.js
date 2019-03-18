//--------------------------------------------Modules--------------------------------------------//
var electron = require('electron');
var {autoUpdater} = require("electron-updater");
var path = require('path');
var ejs = require('ejs-electron'); // keep this for the .ejs files work
var fse = require('fs-extra');

let result
if (process.platform === 'win32') {
    result = path.join(__dirname, "app.ico")
} else if (process.platform === 'linux') {
    result = path.join(__dirname, "./app.png")
}

var {app, BrowserWindow, ipcMain} = electron;
//-----------------------------------------------------------------------------------------------//



// Check if backups folder exists----------------------------------------------------------------//
var BackupsPath = path.join(app.getPath('userData'), "backups");
if(fse.existsSync(BackupsPath) == false) {
    fse.mkdirSync(BackupsPath);
}
//-----------------------------------------------------------------------------------------------//



// Check if data folder exists-------------------------------------------------------------------//
var DataPath = path.join(app.getPath('userData'), "data");
if(fse.existsSync(DataPath) == false) {
    fse.mkdirSync(DataPath);
}
//-----------------------------------------------------------------------------------------------//



// Check if bot_data.json exists-----------------------------------------------------------------//
var BotDataPath = path.join(DataPath, "bot_data.json");
if(fse.existsSync(BotDataPath) == false) {
    const obj_bot = JSON.stringify({
        "Backup_Timer_Value": "",
        "Backup_Timer_Type": "1"
    });
    fse.writeFileSync(BotDataPath, obj_bot);
}
//-----------------------------------------------------------------------------------------------//



// Check if mods_data.json exists----------------------------------------------------------------//
var ModsDataPath = path.join(DataPath, "mods_data.json");
if(fse.existsSync(ModsDataPath) == false) {
    const obj_mods = JSON.stringify({
        "Alternative_Mods": false
    });
    fse.writeFileSync(ModsDataPath, obj_mods);
}
//-----------------------------------------------------------------------------------------------//

// Check if data.json exists---------------------------------------------------------------------//
var dataDataPath = path.join(DataPath, "data.json");
if(fse.existsSync(dataDataPath) == false) {
    const obj = JSON.stringify({
        "DBM_Path": "",
        "Bot_Path": "",
        "Discord_RPC": true
    });
    fse.writeFileSync(dataDataPath, obj);
    var _obj = JSON.parse(fse.readFileSync(path.join(app.getPath("userData"), "data", "data.json"), 'utf8')); // THIS IS THE OBJ
} else {
    var _obj = JSON.parse(fse.readFileSync(path.join(app.getPath("userData"), "data", "data.json"), 'utf8')); // THIS IS THE OBJ
}
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
        icon: result,
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
    let bounds = electron.screen.getPrimaryDisplay().bounds;
    let x = bounds.x + ((bounds.width - 1050) / 2);
    let y = bounds.y + ((bounds.height - 650) / 2);
    menuScreen = new BrowserWindow({
        'minWidth': 1050,
        'minHeight': 650,
        'width': 1050,
        'height': 650,
        x: x,
        y: y,
        title: "DBM Network Client",
        frame: true,
        show: false,
        transparent: false,
        icon: result,
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
function DiscordRPC() {
if(_obj.Discord_RPC == true) {
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
