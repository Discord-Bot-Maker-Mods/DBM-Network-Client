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
// Open Browser Window
//
// This is the system that opens the browser window when you
// press the Browser button on Settings tab.
//
// OUTDATED // OUTDATED // OUTDATED // OUTDATED // OUTDATED // OUTDATED //
//---------------------------------------------------------------------//

document.getElementById('SettingsNotSecretBrowser1').addEventListener('click', _ => {
    document.getElementById('SettingsSecretBrowser1').click()
});
function onFileChange1() {
    document.getElementById("SettingsDBMPath").value = document.getElementById("SettingsSecretBrowser1").files[0].path;
}

document.getElementById('SettingsNotSecretBrowser2').addEventListener('click', _ => {
    document.getElementById('SettingsSecretBrowser2').click()
});
function onFileChange2() {
    document.getElementById("SettingsBotPath").value = document.getElementById("SettingsSecretBrowser2").files[0].path;
}