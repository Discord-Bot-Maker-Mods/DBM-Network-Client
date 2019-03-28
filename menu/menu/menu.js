//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var path = require('path');
var fse = require('fs-extra');
var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// Check If Backups Folder Exists
//
// This checks if the Backups folder exists.
// If not, creates one.
//---------------------------------------------------------------------//

var BackupsPath = path.join(require('electron').remote.app.getPath('userData'), "backups");
if(fse.existsSync(BackupsPath) == false) {
    fse.mkdirSync(BackupsPath);
}

//---------------------------------------------------------------------//
// Check If Data Folder Exists
//
// This checks if the data folder exists.
// If not, creates one.
//---------------------------------------------------------------------//

var DataPath = path.join(require('electron').remote.app.getPath('userData'), "data");
if(fse.existsSync(DataPath) == false) {
    fse.mkdirSync(DataPath);
}

//---------------------------------------------------------------------//
// Check If bot_data.json Exists
//
// This checks if the bot_data.json file exists.
// If not, creates one.
//---------------------------------------------------------------------//

var BotDataPath = path.join(DataPath, "bot_data.json");
if(fse.existsSync(BotDataPath) == false) {
    const obj_bot = JSON.stringify({
        "Backup_Timer_Value": "",
        "Backup_Timer_Type": "1"
    });
    fse.writeFileSync(BotDataPath, obj_bot);
}

//---------------------------------------------------------------------//
// Check If mods_data.json Exists
//
// This checks if the mods_data.json file exists.
// If not, creates one.
//---------------------------------------------------------------------//

var ModsDataPath = path.join(DataPath, "mods_data.json");
if(fse.existsSync(ModsDataPath) == false) {
    const obj_mods = JSON.stringify({
        "Alternative_Mods": false
    });
    fse.writeFileSync(ModsDataPath, obj_mods);
}

//---------------------------------------------------------------------//
// Check If data.json Exists
//
// This checks if the data.json file exists.
// If not, creates one.
//---------------------------------------------------------------------//

var dataDataPath = path.join(DataPath, "data.json");
if(fse.existsSync(dataDataPath) == false) {
    const obj = JSON.stringify({
        "DBM_Path": "",
        "Bot_Path": "",
        "Discord_RPC": true
    });
    fse.writeFileSync(dataDataPath, obj);
}