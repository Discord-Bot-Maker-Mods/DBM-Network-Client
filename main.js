// DBM Mod Installer - Electron JS Version
'use strict';
const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron;

const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');
require('electron-unhandled')();

const isDev = require('electron-is-dev');
const isMac = (process.platform == 'darwin');


if (isDev) {
    console.log('Running in development');
    require('electron-debug')({showDevTools: true});

    require('electron-reload')(__dirname, {
        // Note that the path to electron may vary according to the main file
        electron: require(`${__dirname}/node_modules/electron`)
    });
} else {
    console.log('Running in production');
}

// initialize the window
let mainWindow;
app.on('ready', function(){
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, show: false}) //,icon:__dirname+'img/dbmmods.png'})

    // window options
    mainWindow.setMinimumSize(680, 480);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ejs' ,'index.ejs'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();      
    });

    // build menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('mod:install', function(e, item){
    mainWindow.webContents.send('mod:install', item)
})

// if its on a mac, close it properly
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

// file menu
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: isMac ? 'Command+Q' : "Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    }
    
]

if(isDev) mainMenuTemplate.push(
    {
        label:'Development',
        submenu:[
            {
                role: 'reload'
            },
            {
                label: 'Open Dev Tools',
                accelerator: isMac ? 'Command+I' : "Ctrl+I",
                click(item, focusedWindow){
                    focusedWindow.openDevTools()
                }
            }
        ]
    }
);

if (isMac) mainMenuTemplate.push({});

// discord rich presence
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

rpc.once('ready', () => {

    rpc.setActivity({
        details: "Using DBM Network Client!",
        state: isDev ? 'Developing On It!' : 'Using It!',
        startTimestamp,
        largeImageKey: '',
        largeImageText: '',
        smallImageKey: '',
        smallImageText: '',
        instance: true,
    });    
});

rpc.login("469611902528520193").catch(console.error);
