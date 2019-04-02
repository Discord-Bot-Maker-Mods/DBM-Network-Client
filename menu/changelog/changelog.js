//---------------------------------------------------------------------//
// Modules
//
// This is where you put the NPM Modules to use in this file.
//---------------------------------------------------------------------//

var $ = jQuery = require('jquery');

//---------------------------------------------------------------------//
// Fixed Height Scale
//
// This fixes and adjusts the elements to the corners of the app.
//---------------------------------------------------------------------//

$("#ChangelogStuffBelow").height(window.innerHeight - 130); // Applies this height on start of the app

$(window).resize(function(){
    $("#ChangelogStuffBelow").height(window.innerHeight - 130);
});