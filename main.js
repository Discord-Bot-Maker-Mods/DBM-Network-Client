// DBM Mod Installer - Electron JS Version
'use strict';
const electron = require('electron');
const { app, BrowserWindow, Menu, Tray, ipcMain } = electron;

const settings = require('electron-settings');
const windowStateKeeper = require('electron-window-state');

const path = require('path');
const url = require('url');
const ejs = require('ejs-electron');
require('electron-unhandled')();

const isDev = require('electron-is-dev');
const isMac = (process.platform == 'darwin');


if (isDev) {
    console.log('Running in development');
    //require('electron-debug')({showDevTools: true});

    require('electron-reload')(__dirname, {
        // Note that the path to electron may vary according to the main file
        electron: require(`${__dirname}/node_modules/electron`)
    });
} else {
    console.log('Running in production');
}

// initialize the window
let mainWindow = null;
let splashWindow = null;
let tray = null;
app.on('ready', function(){

    splashWindow = new BrowserWindow({    
        'width': 290,
        'height': 290,
        frame: false, 
        show: false ,
        transparent: true,
        center: true
    });

    // load the splash page
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ejs' ,'splash.ejs'),
        protocol: 'file',
        slashes: true
    }));
    splashWindow.show();

    if(!settings.get('hasRan')){
        settings.set('active_page', 'home-mode');
        settings.set('hasRan', true);
    }

    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });
   
    mainWindow = new BrowserWindow({    
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    frame: false, 
    show: false ,
    icon: 'img/splash-icon.png'});


    mainWindowState.manage(mainWindow);

    tray = new Tray('img/splash-icon.png');
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    tray.on('click', () => {
        mainWindow.show();   
      
    });

    tray.setToolTip('DBM Network Client: 0 Bots Running.');
    tray.setContextMenu(contextMenu);


    // window options
    mainWindow.setMinimumSize(800, 600);

    // load the index page
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ejs' ,'index.ejs'),
        protocol: 'file',
        slashes: true
    }));


    mainWindow.on('closed', () => {
        mainWindow = null;
        tray = null;
    });

    ipcMain.on('show_window', () => {
        splashWindow.hide();
        mainWindow.show();   
    })

    mainWindow.on('minimize', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            mainWindow.hide();
        }
    
        return false;
    });
    
    mainWindow.on('show', function () {
        tray.setHighlightMode('always');
    });

    // build menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});


// if its on a mac, close it properly
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

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
];

const trayMenuTemplate = [
    {
        label: 'Quit',
        accelerator: isMac ? 'Command+Q' : "Ctrl+Q",
        click(){
            app.quit();
         }                  
    }  
];

if(isDev){

    
    mainMenuTemplate.push(
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
                        focusedWindow.openDevTools();
                    }
                }
            ]
        }
    );

    trayMenuTemplate.push(
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
                        mainWindow.openDevTools();
                    }
                }
            ]
        }
    );
} 

if (isMac) mainMenuTemplate.push({});

// discord rich presence
/*
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

function setActivity(mode, time){
    rpc.setActivity({
        details: "DBM Network Client!",
        state: 'Mode: ' + mode,
        startTimestamp: time,
        largeImageKey: '',
        largeImageText: '',
        smallImageKey: '',
        smallImageText: '',
        instance: false,
    });    
}

ipcMain.on('mode:changed', function(e, changed){
    setActivity(changed.mode, new Date());
});

rpc.once('ready', () => {
    setActivity("Development", startTimestamp);    
});

rpc.login("469611902528520193").catch(console.error);
*/