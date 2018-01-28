// DBM Mod Installer - Electron JS Version

'use strict';

const {app, BrowserWindow, Menu, ipcMain} = require('electron')
    , path = require('path')
    , url = require('url')
	
require('electron-unhandled')();

const isDev = (process.env.NODE_ENV !== 'production')
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


var DBMMI = {
    Window: { height: 650, width: 800 },
    Actions: {}
}

// initialize the window
let mainWindow;

function createWindow(){

    // create browser window
    mainWindow = new BrowserWindow({width: DBMMI.Window.width, height: DBMMI.Window.height, frame: false}) //,icon:__dirname+'img/dbmmods.png'})

    // load index.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // build menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}
app.on('ready', createWindow);


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
