//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var path = require('path');
var fse = require('fs-extra');
var {exec} = require('child_process');
var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// JSON OBJ
//
// Use these JSON objects that contain the App Data.
// obj -> data.json
// obj_bot -> bot_data.json
//---------------------------------------------------------------------//

var obj = JSON.parse(fse.readFileSync(dataDataPath, 'utf8'));
var obj_bot = JSON.parse(fse.readFileSync(BotDataPath, 'utf8'));

//---------------------------------------------------------------------//
// Load Values
//
// Loads values from JSON files.
//---------------------------------------------------------------------//

$('#BotBackupSelect').val(obj_bot.Backup_Timer_Type);
$('#BotBackupAmount').val(obj_bot.Backup_Timer_Value);

if($('#BotBackupSelect').val() == 1) {
    $('#BotBackupAmount').prop('disabled', true);
}

//---------------------------------------------------------------------//
// function BotConsoleLog(text)
//
// This function sends text to Bot Console Log.
//---------------------------------------------------------------------//

function BotConsoleLog(text) {
    $('#BotConsoleLog').append(text);
    if(!$('#BotConsoleLog').is(':visible')) {
        $('#BotConsoleLogNumber').html(parseInt($('#BotConsoleLogNumber').text(),10) + 1 || 1)
    }
}

//---------------------------------------------------------------------//
// function CheckIfDBMPathExists()
//
// This function checks if DBM Path exists and is valid.
//---------------------------------------------------------------------//

function CheckIfDBMPathExists() {
    if(obj.DBM_Path == "") {
        BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't set in Settings\n`);
        return;
    }

    if(!fse.existsSync(obj.DBM_Path)) {
        BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: DBM Path isn't valid\n`);
        return;
    }
}

//---------------------------------------------------------------------//
// function CheckIfBotPathExists()
//
// This function checks if Bot Path exists and is valid.
//---------------------------------------------------------------------//

function CheckIfBotPathExists() {
    if(obj.Bot_Path == "") {
        BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't set in Settings\n`);
        return;
    }

    if(!fse.existsSync(obj.Bot_Path)) {
        BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: Bot Path isn't valid\n`);
        return;
    }
}

//---------------------------------------------------------------------//
// function BotStartClick()
//
// This is the function that starts your bot when you
// press the Start button on Bot tab.
//---------------------------------------------------------------------//

function BotStartClick() {
    //-----------------------------Check if Bot Path exists and is valid-----------------------------//
    CheckIfBotPathExists();
    //-----------------------------------------------------------------------------------------------//


    const grep = process.platform === "win32" ? exec(`start cmd.exe /k "cd "${obj.Bot_Path}" && node bot.js"`) : exec(`gnome-terminal --command="bash -c 'cd ${(obj.Bot_Path).replace(/\ /g, "\\ ")}; node bot.js; ls; $SHELL'"`);
    BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - Bot Started\n`);

    if(process.platform === "win32") { // Linux doesn't detect this...
        grep.on('close', (code, signal) => {
            BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - Bot Stopped\n`);
        });
    }

    grep.on('error', (err) => {
        BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - ERROR: ${err}\n`);
    });
}

//---------------------------------------------------------------------//
// function BotCopyActionsClick()
//
// This is the function that copies and pastes your actions folder
// on your bot folder when you press the Copy DBM Actions Folder 
// button on Bot tab.
//---------------------------------------------------------------------//

function BotCopyActionsClick() {
    const start = new Date();
    var processB1 = 0;

    BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - Copying and pasting DBM Actions Folder...\n`);


    //------------------------Check if DBM Path and Bot Path exists and is valid---------------------//
    CheckIfDBMPathExists();
    CheckIfBotPathExists();
    //-----------------------------------------------------------------------------------------------//


    fse.readdirSync(path.join(obj.DBM_Path, "actions")).forEach(function(file, index, arr) {
        if(file.match(/^.+\.js$/i)) {
            fse.ensureDirSync(path.join(obj.Bot_Path, "actions"));
            fse.copyFileSync(path.join(obj.DBM_Path, "actions", file), path.join(obj.Bot_Path, "actions", file));
        }
        processB1++;
        if(processB1 === arr.length) {
            BotConsoleLog(`${new Date().toTimeString().slice(0,8)} - DBM Actions Folder copied and pasted in your Bot successfully! (${((new Date() - start)*10**-3).toFixed(3)}s)\n`);
        }
    });
}

//---------------------------------------------------------------------//
// function BotBackupSelectOnChange()
//
// This is the function that makes the backup data folder system
// work.
//---------------------------------------------------------------------//

BotBackupSelectOnChange(); //Executes the function BotBackupSelectOnChange() on start of the app

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
            //-----------------------------Check if Bot Path exists and is valid-----------------------------//
            CheckIfBotPathExists();
            //-----------------------------------------------------------------------------------------------//

            const d = new Date();
            const fname = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + "-" + d.toLocaleTimeString().replace(/:/g, "-");
            fse.ensureDirSync(path.join(BackupsPath, fname));
            fse.copySync(path.join(obj.Bot_Path, "data"), path.join(BackupsPath, fname));

            BotConsoleLog(`${d.toTimeString().slice(0,8)} - New backup folder created: ${fname}\n`);
    }, timesetBackup);
};

//------------------------------------Store value in Data----------------------------------------//
obj_bot.Backup_Timer_Value = $("#BotBackupAmount").val();
obj_bot.Backup_Timer_Type = BackupSelectValue;
fse.writeFileSync(BotDataPath, JSON.stringify(obj_bot));
//-----------------------------------------------------------------------------------------------//
}