//--------------------------------------------Modules--------------------------------------------//
var path = require('path');
var fse = require('fs-extra');
const { exec } = require('child_process');

var $ = jQuery = require('jquery');
//-----------------------------------------------------------------------------------------------//



var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));
var obj_bot = JSON.parse(fse.readFileSync(BotDataPath, 'utf8'));

// Load values
$('#BotBackupSelect').val(obj_bot.Backup_Timer_Type);
$('#BotBackupAmount').val(obj_bot.Backup_Timer_Value);

if($('#BotBackupSelect').val() == 1) {
    $('#BotBackupAmount').prop('disabled', true);
}

function BotStartClick() {
    // Check if Bot Path exists and is valid
    if(obj.Bot_Path == "") {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't set in Settings\n`);
        return;
    }

    if(!fse.existsSync(obj.Bot_Path)) {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't valid\n`);
        return;
    }
    //-----------------------------------------------------------------------------------------------//

    const grep = process.platform === "win32" ? exec(`start cmd.exe /k "cd "${obj.Bot_Path}" && node bot.js"`) : exec(`gnome-terminal --command="bash -c 'cd ${(obj.Bot_Path).replace(/\ /g, "\\ ")}; node bot.js; ls; $SHELL'"`);
    $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - Bot Started\n`);

    if(process.platform === "win32") { // Linux doesn't detect this...
        grep.on('close', (code, signal) => {
            $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - Bot Stopped\n`);
        });
    }

    grep.on('error', (err) => {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
    });
}

function BotCopyActionsClick() {
    const start = new Date();
    var processB1 = 0;

    $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - Copying and pasting DBM Actions Folder...\n`);

    // Check if DBM Path exists and is valid
    if(obj.DBM_Path == "") {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't set in Settings\n`);
        return;
    }

    if(!fse.existsSync(obj.DBM_Path)) {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't valid\n`);
        return;
    }
    //-----------------------------------------------------------------------------------------------//

    // Check if Bot Path exists and is valid
    if(obj.Bot_Path == "") {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't set in Settings\n`);
        return;
    }

    if(!fse.existsSync(obj.Bot_Path)) {
        $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't valid\n`);
        return;
    }
    //-----------------------------------------------------------------------------------------------//

    fse.readdirSync(path.join(obj.DBM_Path, "actions")).forEach(function(file, index, arr) {
        if(file.match(/^.+\.js$/i)) {
            fse.ensureDirSync(path.join(obj.Bot_Path, "actions"));
            fse.copyFileSync(path.join(obj.DBM_Path, "actions", file), path.join(obj.Bot_Path, "actions", file));
        }
        processB1++;
        if(processB1 === arr.length) {
            $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - DBM Actions Folder copied and pasted in your Bot successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
        }
    });
}

BotBackupSelectOnChange();
function BotBackupSelectOnChange() {
    const BackupSelectValue =  $("#BotBackupSelect").val();
    let timesetBackup = null;
    if(BackupSelectValue == 1) {
        timesetBackup = null;
    } else if(BackupSelectValue == 2) {
        timesetBackup = $("#BotBackupAmount").val();
    } else if(BackupSelectValue == 3) {
        timesetBackup = $("#BotBackupAmount").val() * 1000;
    } else if(BackupSelectValue == 4) {
        timesetBackup = $("#BotBackupAmount").val() * 60 * 1000;
    } else if(BackupSelectValue == 5) {
        timesetBackup = $("#BotBackupAmount").val() * 60 * 60 * 1000;
    } else if(BackupSelectValue == 6) {
        timesetBackup = $("#BotBackupAmount").val() * 24 * 60 * 60 * 1000;
    };

    if (this.currentInterval) {
        clearInterval(this.currentInterval);
    };

    if (!isNaN(BackupSelectValue) && timesetBackup != null) {
        this.currentInterval = setInterval(function() {
            // Check if Bot Path exists and is valid
            if(obj.Bot_Path == "") {
                $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't set in Settings\n`);
                return;
            }

            if(!fse.existsSync(obj.Bot_Path)) {
                $('#BotConsoleLog').append(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't valid\n`);
                return;
            }
            //-----------------------------------------------------------------------------------------------//

            const d = new Date();
            const fname = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + "-" + d.toLocaleTimeString().replace(/:/g, "-");
            fse.ensureDirSync(path.join(BackupsPath, fname));
            fse.copySync(path.join(obj.Bot_Path, "data"), path.join(BackupsPath, fname));

            $('#BotConsoleLog').append(`${d.toTimeString().slice(0,8)} - New backup folder created: ${fname}\n`);
    }, timesetBackup);
};

// Store value in Data
obj_bot.Backup_Timer_Value = $("#BotBackupAmount").val();
obj_bot.Backup_Timer_Type = BackupSelectValue;
fse.writeFileSync(BotDataPath, JSON.stringify(obj_bot));
}