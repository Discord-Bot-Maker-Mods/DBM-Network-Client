//--------------------------------------------Modules--------------------------------------------//
var electron = require('electron');
const {ipcRenderer} = electron;

var $ = jQuery = require('jquery');
//-----------------------------------------------------------------------------------------------//



var blockerClick = false;

function ModsTabClick() {
    if(blockerClick === false) {
        blockerClick = true;
        $('#BotWindow').fadeOut(200);
        $('#SettingsWindow').fadeOut(200);
        $('#ChangelogWindow').fadeOut(200);
        setTimeout(() => {
            $('#ModsWindow').fadeIn(200);
            ipcRenderer.send('mode:changed', 'Mods');
            blockerClick = false;
        }, 200);
    }
}

function BotTabClick() {
    if(blockerClick === false) {
        blockerClick = true;
        $('#ModsWindow').fadeOut(200);
        $('#SettingsWindow').fadeOut(200);
        $('#ChangelogWindow').fadeOut(200);
        setTimeout(() => {
            $('#BotWindow').fadeIn(200);
            ipcRenderer.send('mode:changed', 'Bot');
            blockerClick = false;
        }, 200);
    }
}

function SettingsTabClick() {
    if(blockerClick === false) {
        blockerClick = true;
        $('#ModsWindow').fadeOut(200);
        $('#BotWindow').fadeOut(200);
        $('#ChangelogWindow').fadeOut(200);
        setTimeout(() => {
            $('#SettingsWindow').fadeIn(200);
            ipcRenderer.send('mode:changed', 'Settings');
            blockerClick = false;
        }, 200);
    }
}

function ChangelogTabClick() {
    if(blockerClick === false) {
        blockerClick = true;
        $('#ModsWindow').fadeOut(200);
        $('#BotWindow').fadeOut(200);
        $('#SettingsWindow').fadeOut(200);
        setTimeout(() => {
            $('#ChangelogWindow').fadeIn(200);
            ipcRenderer.send('mode:changed', 'Changelog');
            blockerClick = false;
        }, 200);
    }
}

$('#AppVersion').html(require('electron').remote.app.getVersion());

//------------Electron Updater Stuff------------
ipcRenderer.on('ElectronUpdaterMES', function(event, text) {
    $('#ElectronUPStatus').html("- " + text);
});
//----------------------------------------------