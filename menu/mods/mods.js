//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var path = require('path');
var fse = require('fs-extra');
var repo = require('github-download-parts');
var {dialog} = require('electron').remote;
var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// JSON OBJ
//
// Use these JSON objects that contain the App Data.
// obj -> data.json
// obj_mods -> mods_data.json
//---------------------------------------------------------------------//

var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));
var obj_mods = JSON.parse(fse.readFileSync(ModsDataPath, 'utf8'));

//---------------------------------------------------------------------//
// Load Values
//
// Loads values from JSON files.
//---------------------------------------------------------------------//

$('#ModsAM').prop('checked', obj_mods.Alternative_Mods);

var LocationFolderActions;

//---------------------------------------------------------------------//
// function ModsConsoleLog(text)
//
// This function sends text to Mods Console Log.
//---------------------------------------------------------------------//

function ModsConsoleLog(text) {
    $('#ModsConsoleLog').append(text);
    if(!$('#ModsConsoleLog').is(':visible')) {
        $('#ModsConsoleLogNumber').html(parseInt($('#ModsConsoleLogNumber').text(),10) + 1 || 1)
    }
}

//---------------------------------------------------------------------//
// function CheckIfDBMPathExists()
//
// This function checks if DBM Path exists and is valid.
//---------------------------------------------------------------------//

function CheckIfDBMPathExists() {
    if(obj.DBM_Path == "") {
        ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't set in Settings\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }

    if(!fse.existsSync(obj.DBM_Path)) {
        ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't valid\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }
}

//---------------------------------------------------------------------//
// function ModsInstallationLocChange(element)
//
// This is the function that changes the location of folder to manage
// the DBM Mods when you change the Select value on Mods tab.
//---------------------------------------------------------------------//

ModsInstallationLocChange($("#ModsInstallationLocSelect")); // Executes the function ModsInstallationLocChange() on start of the app
function ModsInstallationLocChange(element) {
    if($(element).val() == 1) {
        LocationFolderActions = path.join(obj.DBM_Path, "actions");
    } else if($(element).val() == 2) {
        LocationFolderActions = path.join(obj.Bot_Path, "actions");
    }
    ModsListMods(LocationFolderActions); // Refresh the list of mods on Mods tab
    $(".ModsListModsText").width(window.innerWidth - 550); // Applies this width on start of the app
}

//---------------------------------------------------------------------//
// function ModsInstallClick()
//
// This is the function that installs the DBM Mods when you
// press the Install button on Mods tab.
//---------------------------------------------------------------------//

function ModsInstallClick() {
    const e = document.getElementById("ModsBranchSelect");
    const branch = e.options[e.selectedIndex].value;

    const alternativeM = $('#ModsAM').prop('checked');

    const start = new Date();
    ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - Installing DBM Mods${alternativeM == true ? " and Alternative Mods" : ""} [${$('#ModsBranchSelect option:selected').text()}]...\n`);
    $('.Dbutton_BlockStuff').prop('disabled', true);


    //-----------------------------Check if DBM Path exists and is valid-----------------------------//
    CheckIfDBMPathExists();
    //-----------------------------------------------------------------------------------------------//


    repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, LocationFolderActions, 'actions')
    .then(() => {
        if(alternativeM == true) {
            repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, LocationFolderActions, 'AlternativeMods')
            .then(() => {
                ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - DBM Mods and Alternative Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
                ModsListMods(LocationFolderActions); // Refresh the list of mods on Mods tab
            })
            .catch((err) => {
                ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
            });
        } else {
            ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - DBM Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
            ModsListMods(LocationFolderActions); // Refresh the list of mods on Mods tab
        }
    })
    .catch((err) => {
        ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
    });
}

//---------------------------------------------------------------------//
// function ModsUninstallClick()
//
// This is the function that uninstalls the DBM Mods when you
// press the Uninstall button on Mods tab.
//---------------------------------------------------------------------//

function ModsUninstallClick() {
    const start = new Date();
    ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - Uninstalling DBM Mods...\n`);
    $('.Dbutton_BlockStuff').prop('disabled', true);


    //-----------------------------Check if DBM Path exists and is valid-----------------------------//
    CheckIfDBMPathExists();
    //-----------------------------------------------------------------------------------------------//


    var processM1 = 0;
    var processM2 = 0;

    fse.readdirSync(LocationFolderActions).forEach(function(file, index, arr) {
        if(file.match(/MOD\.js/i)) {
            fse.unlinkSync(path.join(LocationFolderActions, file));
            processM2++;
        }
        processM1++;
        if(processM1 === arr.length) {
            ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ${processM2} ${processM2 === 1 ? 'mod' : 'mods'} uninstalled successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
            ModsListMods(LocationFolderActions); // Refresh the list of mods on Mods tab
        }
    });
}

//---------------------------------------------------------------------//
// function ModsAMClick()
//
// This function store value from Switch about Install Alternative
// Mods on Mods Tab.
//---------------------------------------------------------------------//

function ModsAMClick() {
    obj_mods.Alternative_Mods = $('#ModsAM').prop('checked');
    fse.writeFileSync(ModsDataPath, JSON.stringify(obj_mods));
}

//---------------------------------------------------------------------//
// function ModsListMods(_path)
//
// This function shows a list of your Mods on Mods Tab.
//---------------------------------------------------------------------//

function ModsListMods(_path) {
    $("#ModsListMods").html("");

    fse.readdirSync(_path).forEach(function(file, index, arr) {
        if(file.match(/MOD\.js/i)) {
            const ModInfoJSON = require(path.join(_path, file))
            $("#ModsListMods").append(`
            <div style="width: 100%; height: 50px; background-color: #1a1a1a;">
                <div style="width: 300px; height: 50px; white-space: nowrap;">
                    <div class="ModsListModsText" style="display: inline-block; width: 10vh; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 30px; line-height: 52px; margin-left: 10;">
                        ${ModInfoJSON.name}
                    </div>
                </div>
                <button class="Dbutton" style="height: 30px; line-height: 30px; float: right; position: relative; top: -40; right: 10;" onclick="ModsDeleteMod(path.join('${_path.replace(/\\/g, "\\\\")}', '${file}'), this)">
                    Delete
                </button>
                <button class="Dbutton" style="height: 30px; line-height: 30px; float: right; position: relative; top: -40; right: 10; margin-right: 10;" onclick="ModsExtraWindowChangeInfo(require(path.join('${_path.replace(/\\/g, "\\\\")}', '${file}'))); $('#ModsExtraWindowDiv').fadeIn(500); setTimeout(function(){ $('#ModsExtraWindow').fadeIn(200) }, 100);">
                    Show Info
                </button>
            </div>
            `);
        }
    });
}

//---------------------------------------------------------------------//
// function ModsDeleteMod(ModPath, element)
//
// This is the function that deletes the Mod when you
// press the Delete button on list of mods on Mods tab.
//---------------------------------------------------------------------//

function ModsDeleteMod(ModPath, element) {
    const ModJSON = require(ModPath);
    const options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'DBM Network Client',
        message: `Are you sure you want to delete the Mod: ${$((ModJSON.name).replace(/\//g, '\\/')).text() || ModJSON.name}?`,
        detail: 'This action cannot be reverted!'
    };
    dialog.showMessageBox(options, function(response) {
        if(response == 0) {
            fse.unlinkSync(ModPath);
            $(element).parent().closest('div').remove();
            ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ${ModJSON.name} deleted successfully!\n`);
        }
    });
}

//---------------------------------------------------------------------//
// function ModsExtraWindowChangeInfo(_JSON)
//
// This is the function that changes the info on Extra Window
// on Mods tab.
//---------------------------------------------------------------------//

function ModsExtraWindowChangeInfo(_JSON) {
    $("#ModsExtraWindowInfoName").html(_JSON.name);
    $("#ModsExtraWindowInfoAuthor").html("by: " + _JSON.author);
    $("#ModsExtraWindowInfoTrueSection").html(_JSON.section);
    $("#ModsExtraWindowInfoTrueDescription").html(_JSON.short_description);
    $("#ModsExtraWindowInfoVersion").html("v" + _JSON.version);
}

//---------------------------------------------------------------------//
// function ModsOpenActionsFolder(number)
//
// This is the function that opens you the actions folder
//---------------------------------------------------------------------//

function ModsOpenActionsFolder(number) {
    if(process.platform === "win32") {
        if(number == 1) {
            exec(`start "" "${path.join(obj.DBM_Path, "actions")}"`)
        } else {
            exec(`start "" "${path.join(obj.Bot_Path, "actions")}"`)
        }
    } else {
        if(number == 1) {
            exec(`nautilus ${path.join(obj.DBM_Path, "actions")}`);
        } else {
            exec(`nautilus ${path.join(obj.Bot_Path, "actions")}`);
        }
    }
}

//---------------------------------------------------------------------//
// Fixed Height Scale
//
// This fixes and adjusts the elements to the corners of the app.
//---------------------------------------------------------------------//

$("#ModsListMods").height(window.innerHeight - 430); // Applies this height on start of the app
$(".ModsListModsText").width(window.innerWidth - 550); // Applies this width on start of the app

$(window).resize(function(){
    $("#ModsListMods").height(window.innerHeight - 430);
    $(".ModsListModsText").width(window.innerWidth - 550);
});