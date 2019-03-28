//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var path = require('path');
var fse = require('fs-extra');
var repo = require('github-download-parts');
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


    repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, path.join(obj.DBM_Path, "actions"), 'actions')
    .then(() => {
        if(alternativeM == true) {
            repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, path.join(obj.DBM_Path, "actions"), 'AlternativeMods')
            .then(() => {
                ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - DBM Mods and Alternative Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
            })
            .catch((err) => {
                ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
            });
        } else {
            ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - DBM Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
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

    fse.readdirSync(path.join(obj.DBM_Path, "actions")).forEach(function(file, index, arr) {
        if(file.match(/MOD\.js/i)) {
            fse.unlinkSync(path.join(obj.DBM_Path, "actions", file));
            processM2++;
        }
        processM1++;
        if(processM1 === arr.length) {
            ModsConsoleLog(`${new Date().toTimeString().slice(0,8)} - ${processM2} ${processM2 === 1 ? 'mod' : 'mods'} uninstalled successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
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