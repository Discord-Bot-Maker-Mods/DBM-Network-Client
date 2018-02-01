// DBM Mod Installer - Electron JS Version
'use strict';

const {app, BrowserWindow, Menu, ipcMain} = require('electron')
    , path = require('path')
    , url = require('url')
    , ejse = require('ejs-electron')


require('electron-unhandled')();


const isDev = require('electron-is-dev')
const isMac = (process.platform == 'darwin')


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
let mainWindow;
let splashWindow;


const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

var DBMMM = {
    Window: { height: 650, width: 800 },
    Checks: { isDev: isDev, isMac: isMac},
    Actions: {}
}

ejse.data('DBMMM', DBMMM)

app.on('ready', function(){

    // create browser window
    mainWindow = new BrowserWindow({width: DBMMM.Window.width, height: DBMMM.Window.height, frame: false, show: false}) //,icon:__dirname+'img/dbmmods.png'})


    splashWindow = new BrowserWindow({width: 400, height: 400, transparent: true, frame: false, alwaysOnTop: true});

    // load index.html
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ejs' ,'splash.ejs'),
        protocol: 'file',
        slashes: true
    }));

    // load index.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ejs' ,'index.ejs'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {

        // wait 2 seconds no matter what happens
        setTimeout(function(){ 
    
            splashWindow.destroy();
            mainWindow.show();
    
        }, 2000 );      
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
