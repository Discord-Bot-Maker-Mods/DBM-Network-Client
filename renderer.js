'use strict'
const {webFrame} = require('electron'); 

function initialize(){
    webFrame.setZoomFactor(0.85);

}

initialize();

window.settings = require('electron').remote.require('electron-settings');
window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');






  
