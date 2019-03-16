//--------------------------------------------Modules--------------------------------------------//
//var electron = require('electron');
var path = require('path');
//var ejs = require('ejs-electron');
var fse = require('fs-extra');
//const { exec } = require('child_process');
//const {ipcRenderer} = electron;

var $ = jQuery = require('jquery');
//-----------------------------------------------------------------------------------------------//



// Check if backups folder exists----------------------------------------------------------------//
var BackupsPath = path.join(require('electron').remote.app.getPath('userData'), "backups");
if(fse.existsSync(BackupsPath) == false) {
    fse.mkdirSync(BackupsPath);
}
//-----------------------------------------------------------------------------------------------//



// Check if data folder exists-------------------------------------------------------------------//
var DataPath = path.join(require('electron').remote.app.getPath('userData'), "data");
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
}
//-----------------------------------------------------------------------------------------------//