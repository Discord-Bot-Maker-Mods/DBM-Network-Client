//--------------------------------------------Modules--------------------------------------------//
var path = require('path');
var fse = require('fs-extra');

var $ = jQuery = require('jquery');
//-----------------------------------------------------------------------------------------------//



var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));
var obj_mods = JSON.parse(fse.readFileSync(ModsDataPath, 'utf8'));

// Load values
$('#ModsAM').prop('checked', obj_mods.Alternative_Mods);

function ModsInstallClick() {
    const repo = require('github-download-parts');

    const e = document.getElementById("ModsBranchSelect");
    const branch = e.options[e.selectedIndex].value;

    const alternativeM = $('#ModsAM').prop('checked');

    const start = new Date();
    $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - Installing DBM Mods${alternativeM == true ? " and Alternative Mods" : ""} [${$('#ModsBranchSelect option:selected').text()}]...\n`);
    $('.Dbutton_BlockStuff').prop('disabled', true);


    // Check if DBM Path exists and is valid
    if(obj.DBM_Path == "") {
        $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't set in Settings\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }

    if(!fse.existsSync(obj.DBM_Path)) {
        $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't valid\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }
    //-----------------------------------------------------------------------------------------------//


    repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, path.join(obj.DBM_Path, "actions"), 'actions')
    .then(() => {
        if(alternativeM == true) {
            repo({repo: "Discord-Bot-Maker-Mods/DBM-Mods", branch: branch}, path.join(obj.DBM_Path, "actions"), 'AlternativeMods')
            .then(() => {
                $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - DBM Mods and Alternative Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
            })
            .catch((err) => {
                $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
                $('.Dbutton_BlockStuff').prop('disabled', false);
            });
        } else {
            $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - DBM Mods installed successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
        }
    })
    .catch((err) => {
        $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
    });
}

function ModsUninstallClick() {
    const start = new Date();
    $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - Uninstalling DBM Mods...\n`);
    $('.Dbutton_BlockStuff').prop('disabled', true);

    // Check if DBM Path exists and is valid
    if(obj.DBM_Path == "") {
        $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't set in Settings\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }

    if(!fse.existsSync(obj.DBM_Path)) {
        $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't valid\n`);
        $('.Dbutton_BlockStuff').prop('disabled', false);
        return;
    }
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
            $('#ModsConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ${processM2} ${processM2 === 1 ? 'mod' : 'mods'} uninstalled successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
            $('.Dbutton_BlockStuff').prop('disabled', false);
        }
    });
}

function ModsAMClick() {
    obj_mods.Alternative_Mods = $('#ModsAM').prop('checked');
    fse.writeFileSync('ModsDataPath', JSON.stringify(obj_mods));
}