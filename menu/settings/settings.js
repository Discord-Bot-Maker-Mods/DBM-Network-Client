//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var fse = require('fs-extra');
var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// JSON OBJ
//
// Use these JSON objects that contain the App Data.
// obj -> data.json
//---------------------------------------------------------------------//

var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));

//---------------------------------------------------------------------//
// Load Values
//
// Loads values from JSON files.
//---------------------------------------------------------------------//

$('#SettingsDBMPath').val(obj.DBM_Path);
$('#SettingsBotPath').val(obj.Bot_Path);
$('#SettingsDiscordRPC').prop('checked', obj.Discord_RPC);

//---------------------------------------------------------------------//
// function SettingsSaveClick()
//
// This is the function that saves all settings set when you
// press the Save button on Settings tab.
//---------------------------------------------------------------------//

function SettingsSaveClick() {
    obj.DBM_Path = $('#SettingsDBMPath').val();
    obj.Bot_Path = $('#SettingsBotPath').val();
    obj.Discord_RPC = $('#SettingsDiscordRPC').prop('checked');
    fse.writeFileSync(dataDataPath, JSON.stringify(obj));

    DataFilesRefreshClick($('#DataFilesTypeSelect').val() == 'commands' ? JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', 'commands.json'), 'utf8')) : JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', 'events.json'), 'utf8'))); // DATA FILES STUFF! This refresh the list of Commands/Events on Data Files tab
    ModsInstallationLocChange($("#ModsInstallationLocSelect")); // MODS STUFF! This refresh the list of Mods on Mods tab
}

//---------------------------------------------------------------------//
// function SettingsUnsaveClick()
//
// This is the function that unsaves all settings set when you
// press the Unsave button on Settings tab.
//---------------------------------------------------------------------//

function SettingsUnsaveClick() {
    $('#SettingsDBMPath').val(obj.DBM_Path);
    $('#SettingsBotPath').val(obj.Bot_Path);
    $('#SettingsDiscordRPC').prop('checked', obj.Discord_RPC);
}

//---------------------------------------------------------------------//
// function SettingsOpenBrowserClick(element)
//
// This is the function that opens the browser window when you
// press the Browser button on Settings tab.
//---------------------------------------------------------------------//

function SettingsOpenBrowserClick(element) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function(filePaths) {
        if(filePaths) {
            $(element).val(filePaths[0]);
        }
    })
}