 const electron = require('electron');
 const {
     ipcRenderer,
     remote
 } = electron;

 const Menu = remote.Menu;
 const MenuItem = remote.MenuItem;


 var menu = new Menu();
 menu.append(new MenuItem({ label: 'Install Mod', click: function(e) { console.log("clicked"); } }));

 var https = require('https');
 var fs   = require('fs');
 var path = require('path');

 const form = document.querySelector('form')
 const mods = document.querySelector('#mods')


function getMods(){
    fs.readdirSync(path.resolve("mods")).forEach(function(file) {
        if(file.match(/\MOD.js/i)) {
            const action = require(path.join(path.resolve("mods"), file));
            if(action.name && typeof action.action === "function") {
                addModToTable(action);
            }
        }
    });
}
getMods();
    
 function addModToTable(action){

    const tr = document.createElement('tr')
    tr.setAttribute('class', 'table-dark')

    const name = document.createElement('td')

    const headerText = document.createElement("b")
    headerText.innerHTML = action.name
    name.appendChild(headerText)


    name.setAttribute('scope', 'row')
    tr.appendChild(name)

    const section = document.createElement('td')
    section.appendChild(document.createTextNode(action.section))
    tr.appendChild(section)

    const author = document.createElement('td')
    author.appendChild(document.createTextNode(action.author ? action.author : "DBM"))
    tr.appendChild(author)

    const desc = document.createElement('td')
    desc.appendChild(document.createTextNode(action.short_description ? action.short_description : "None"))
    tr.appendChild(desc)

    tr.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      menu.popup(remote.getCurrentWindow());
    });

    mods.appendChild(tr)
 }

// ---- wip

 let onlinefiles = [];
 let localfiles = [];
 let onlineCount;

const BETA_MODS = "https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions";
const MASTER_MODS = "https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions"


function getOnlineMods(){

    $.getJSON("https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions", function(actions) {   
        onlineCount = actions.length        
        actions.forEach(action => {
            onlinefiles.push(action)
        })       
    });

}


function downloadMasterMods(){
    $.getJSON("https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions", function(actions) {   
        onlineCount = actions.length        
        actions.forEach(action => {
            createActionFile(action)
            onlinefiles.push(action)
        })       
    });
}



function createActionFile(action){
    var filepath = path.resolve("mods\\" + action.name);

    var file = fs.createWriteStream(filepath);

    var request = https.get(action.download_url, function(response) {
        response.pipe(file);
    });  
}