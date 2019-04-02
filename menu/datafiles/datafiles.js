//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var path = require('path');
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
// function DataFilesRefreshClick(_JSON)
//
// This function refreshes the list of your Commands/Events when
// you press the Refresh button on Data Files tab.
//---------------------------------------------------------------------//

DataFilesRefreshClick($('#DataFilesTypeSelect').val() == 'commands' ? JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', 'commands.json'), 'utf8')) : JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', 'events.json'), 'utf8'))); // Executes the function DataFilesRefreshClick(_JSON) on start of the app
function DataFilesRefreshClick(_JSON) {
    $("#DataFilesCommandsList").html("");

    _JSON.forEach(function (element, indix) {
        if(element !== null) {
            const elememe = `
            <div style="width: 100%; height: 50px; background-color: #1a1a1a;">
                <div style="width: 300px; height: 50px; white-space: nowrap;">
                    <div class="DataFilesCommandsListText" style="display: inline-block; width: 10vh; height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 30px; line-height: 52px; margin-left: 10;">
                        ${element.name}
                    </div>
                </div>
                <button class="Dbutton" style="height: 30px; line-height: 30px; float: right; position: relative; top: -40; right: 10;" onclick="DataFilesDeleteCommand(${indix}, this)">
                    Delete
                </button>
                <button class="Dbutton" style="height: 30px; line-height: 30px; float: right; position: relative; top: -40; right: 10; margin-right: 10;" onclick="clipboard.writeText(JSON.stringify(JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', '${$('#DataFilesTypeSelect').val()}.json'), 'utf8'))[${indix}], undefined, 2))">
                    Copy Raw Data
                </button>
                <button class="Dbutton" style="height: 30px; line-height: 30px; float: right; position: relative; top: -40; right: 10; margin-right: 10;" onclick="DataFilesExtraWindowChangeInfo(JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, 'data', '${$('#DataFilesTypeSelect').val()}.json'), 'utf8'))[${indix}]); $('#DataFilesExtraWindowDiv').fadeIn(500); setTimeout(function(){ $('#DataFilesExtraWindow').fadeIn(200) }, 100);">
                    Show Info
                </button>
            </div>`;
            $("#DataFilesCommandsList").append(elememe);
        }
    });
    
    $(".DataFilesCommandsListText").width(window.innerWidth - 750); // Applies this width on start of the app
}

//---------------------------------------------------------------------//
// function DataFilesExtraWindowChangeInfo(_JSON)
//
// This is the function that changes the info on Extra Window
// on Data Files tab.
//---------------------------------------------------------------------//

function DataFilesExtraWindowChangeInfo(_JSON) {
    const Name = _JSON.name;
    const Type = $('#DataFilesTypeSelect').val() == 'commands' ? "Command" : "Event";

    const ActionsNumber = _JSON.actions.length;

    if($('#DataFilesTypeSelect').val() == 'commands') {
        const CommandTypeList = ["Normal Command", "Includes Word", "Matches Regular Expression", "Any Message"]
        const CommandRestrictionList = ["None", "Server Only", "Owner Only", "DMs Only", "Bot Owner Only"];

        const CommandType = CommandTypeList[parseInt(_JSON.comType) || 0];
        const CommandRestriction = CommandRestrictionList[parseInt(_JSON.restriction)];
        const UserRequiredPermission = _JSON.permissions;

        $("#DataFilesExtraWindowInfoName").html(Name);
        $("#DataFilesExtraWindowInfoType").html(Type);
        $("#DataFilesExtraWindowInfo1").html("Command Type:");
        $("#DataFilesExtraWindowInfoTrue1").html(CommandType);
        $("#DataFilesExtraWindowInfo2").html("Command Restriction:");
        $("#DataFilesExtraWindowInfoTrue2").html(CommandRestriction);
        $("#DataFilesExtraWindowInfo3").html("User Required Permission:");
        $("#DataFilesExtraWindowInfoTrue3").html(UserRequiredPermission);
        $("#DataFilesExtraWindowInfo4").html("Actions Number:");
        $("#DataFilesExtraWindowInfoTrue4").html(ActionsNumber);
    } else {
        const EventTriggerList = ["None", "Bot Initialization", "Any Message Sent (Deprecated: Use \"Any Message\" command type)", "On Interval", "Bot Join Server", "Bot Leave Server", "Member Join Server", "Member Leave Server", "Channel Create", "Channel Delete", "Role Create", "Role Delete", "Member Banned", "Member Unbanned", "Voice Channel Create", "Voice Channel Delete", "Emoji Create", "Emoji Delete", "Message Deleted", "Server Update", "Member Update", "Presence Update", "Member Voice Update", "Channel Update", "Channel Pins Update", "Role Update", "Message Update", "Emoji Update", "Message Reaction Added", "Message Reaction Removed", "All Message Reactions Removed", "Member Becomes Available", "Member Chunck Received", "Member Starts/Stops Speaks", "User Typing Starts", "User Typing Stops", "Server Becomes Unavailable", "On Bot Error", "On Time Restricted Command"];

        const EventTrigger = EventTriggerList[parseInt(_JSON['event-type'])];

        $("#DataFilesExtraWindowInfoName").html(Name);
        $("#DataFilesExtraWindowInfoType").html(Type);
        $("#DataFilesExtraWindowInfo1").html("Event Trigger:");
        $("#DataFilesExtraWindowInfoTrue1").html(EventTrigger);
        $("#DataFilesExtraWindowInfo2").html("Actions Number:");
        $("#DataFilesExtraWindowInfoTrue2").html(ActionsNumber);
        $("#DataFilesExtraWindowInfo3").html("");
        $("#DataFilesExtraWindowInfoTrue3").html("");
        $("#DataFilesExtraWindowInfo4").html("");
        $("#DataFilesExtraWindowInfoTrue4").html("");
    }
}

//---------------------------------------------------------------------//
// function DataFilesDeleteCommand(indix, element)
//
// This is the function that deletes the Command/Event when you
// press the Delete button on list of commands/events on Data Files tab.
//---------------------------------------------------------------------//

function DataFilesDeleteCommand(indix, element) {
    const commandsJSON = JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, "data", "commands.json"), 'utf8'));
    const options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'DBM Network Client',
        message: `Are you sure you want to delete the Command: ${$(commandsJSON[indix].name).text() || commandsJSON[indix].name}?`,
        detail: 'This action cannot be reverted!'
    };
    dialog.showMessageBox(options, function(response) {
        if(response == 0) {
            commandsJSON.splice(indix, 1);
            fse.writeFileSync(path.join(obj.Bot_Path, 'data', 'commands.json'), JSON.stringify(commandsJSON, undefined, 2));
            $(element).parent().closest('div').remove();
        }
    });
}

//---------------------------------------------------------------------//
// function DataFilesChangeType()
//
// This is the function that trigger the function
// DataFilesRefreshClick(_JSON) when you change the Select value 
// on Data Files tab.
//---------------------------------------------------------------------//

function DataFilesChangeType() {
    DataFilesRefreshClick($("#DataFilesTypeSelect").val() == "commands" ? JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, "data", "commands.json"), 'utf8')) : JSON.parse(fse.readFileSync(path.join(obj.Bot_Path, "data", "events.json"), 'utf8')));
}

//---------------------------------------------------------------------//
// Fixed Height Scale
//
// This fixes and adjusts the elements to the corners of the app.
//---------------------------------------------------------------------//

$("#DataFilesCommandsList").height(window.innerHeight - 210); // Applies this height on start of the app
$(".DataFilesCommandsListText").width(window.innerWidth - 750); // Applies this width on start of the app

$(window).resize(function(){
    $("#DataFilesCommandsList").height(window.innerHeight - 210);
    $(".DataFilesCommandsListText").width(window.innerWidth - 750);
});