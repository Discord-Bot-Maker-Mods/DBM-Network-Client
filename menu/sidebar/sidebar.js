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
            ipcRenderer.send('mode:changed', TabName); // This changes your Discord Rich Presence status. The system is in main.js
            blockerClick = false;
        });
    }
}

//---------------------------------------------------------------------//
// Show Current App Version
//
// This shows the current version of the app in the bottom corner.
//---------------------------------------------------------------------//

$('#SlidebarAppVersion').html(electron.remote.app.getVersion());

//---------------------------------------------------------------------//
// Electron Auto Updater Status
//
// This shows the status of auto-updater in the bottom corner.
// The system is in main.js file.
//---------------------------------------------------------------------//

ipcRenderer.on('ElectronUpdaterMES', function(event, text) {
    $('#SlidebarElectronUPStatus').html("- " + text);
});

//---------------------------------------------------------------------//
// Discord User Info
//
// This shows the information about your Discord Profile in the 
// top corner.
//---------------------------------------------------------------------//

ipcRenderer.on('DiscordUserInfo', function(event, Discord_obj) {
    $("#SlidebarDivDiscordAvatar").attr("src", `https://cdn.discordapp.com/avatars/${Discord_obj.id}/${Discord_obj.avatar}.${Discord_obj.avatar.startsWith("a_") ? "gif" : "png"}?size=128`);
    $("#SlidebarDivDiscordUsername").html(Discord_obj.username);
    $("#SlidebarDivDiscordDiscriminator").html(`#${Discord_obj.discriminator}`);
    $("#SlidebarDivDiscordIDText").html("ID:");
    $("#SlidebarDivDiscordID").html(Discord_obj.id);
});

//---------------------------------------------------------------------//
// Fixed Height Scale
//
// This fixes and adjusts the elements to the corners of the app.
//---------------------------------------------------------------------//

$("#SlidebarButtonsList").height(window.innerHeight - 255); // Applies this height on start of the app

$(window).resize(function(){
    $("#SlidebarButtonsList").height(window.innerHeight - 255);
});