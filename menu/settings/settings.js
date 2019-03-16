//--------------------------------------------Modules--------------------------------------------//
var fse = require('fs-extra');

var $ = jQuery = require('jquery');
//-----------------------------------------------------------------------------------------------//



var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));

// Define the values
$('#SettingsDBMPath').val(obj.DBM_Path);
$('#SettingsBotPath').val(obj.Bot_Path);
$('#SettingsDiscordRPC').prop('checked', obj.Discord_RPC);
//------------------

function SettingsSaveClick() {
    obj.DBM_Path = $('#SettingsDBMPath').val();
    obj.Bot_Path = $('#SettingsBotPath').val();
    obj.Discord_RPC = $('#SettingsDiscordRPC').prop('checked');
    fse.writeFileSync(dataDataPath, JSON.stringify(obj));
}

function SettingsUnsaveClick() {
    $('#SettingsDBMPath').val(obj.DBM_Path);
    $('#SettingsBotPath').val(obj.Bot_Path);
    $('#SettingsDiscordRPC').prop('checked', obj.Discord_RPC);
}

// Browser Button
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
//---------------

/*// Language Stuff
$('#SettingsLanguageSelect').on('change', function() {

});
//---------------*/