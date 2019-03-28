//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var electron = require('electron');
var {ipcRenderer} = electron;
var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// Transition Between Tabs
//
// This is the system that make transition between tabs when you
// click in a new tab button.
//---------------------------------------------------------------------//

var blockerClick = false; // Anti-abuse system for when you click quickly on sidebar buttons

function ButtonTabClick(Window, TabName) {
    if(blockerClick === false && !$(Window).is(":visible")) {
        blockerClick = true;

        $('#MenuAllWindows > div').fadeOut(200).promise().done(function() {
            $(Window).fadeIn(200)
            ipcRenderer.send('mode:changed', TabName);
            blockerClick = false;
        });
    }
}

//---------------------------------------------------------------------//
// Show Current App Version
//
// This shows the current version of the app in the bottom corner.
//---------------------------------------------------------------------//

$('#SlidebarAppVersion').html(require('electron').remote.app.getVersion());

//---------------------------------------------------------------------//
// Electron Auto Updater Status
//
// This shows the status of auto-updater in the bottom corner.
// The system is in main.js file.
//---------------------------------------------------------------------//

ipcRenderer.on('ElectronUpdaterMES', function(event, text) {
    $('#SlidebarElectronUPStatus').html("- " + text);
});