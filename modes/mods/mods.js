'use strict';

const electron = require('electron');
const {
	ipcRenderer,
	remote
} = electron;

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;


const menu = new Menu();
menu.append(new MenuItem({
	label: 'Install Mod',
	click: function (e) {
		console.log("clicked");
	}
}));

const https = require('https');
const fs = require('fs');
const path = require('path');

const form = document.querySelector('form');
const mods = document.querySelector('#mods');


function getMods() {
	const modsPath = path.resolve(path.join('modes', 'mods', "mods"));
	fs.readdirSync(modsPath).forEach(function (file) {
		if (file.match(/\MOD.js/i)) {
			const action = require(path.join(modsPath, file));
			if (action.name && typeof action.action === "function") {
				addModToTable(action);
			}
		}
	});
}
getMods();

function addModToTable(action) {

	const tr = document.createElement('tr');
	tr.setAttribute('class', 'table-dark');

	const name = document.createElement('td');

	const headerText = document.createElement("b");
	headerText.innerHTML = action.name;
	name.appendChild(headerText);

	name.setAttribute('scope', 'row');
	tr.appendChild(name);

	const section = document.createElement('td');
	section.appendChild(document.createTextNode(action.section))
	tr.appendChild(section)

	const author = document.createElement('td');
	author.appendChild(document.createTextNode(action.author ? action.author : "DBM"));
	tr.appendChild(author)

	const desc = document.createElement('td');
	desc.appendChild(document.createTextNode(action.short_description ? action.short_description : "None"));
	tr.appendChild(desc)

	tr.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		menu.popup(remote.getCurrentWindow());
	});

	//mods.appendChild(tr);
}

// ---- wip

let onlinefiles = [];
let localfiles = [];

const BETA_MODS = "https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions";
const MASTER_MODS = "https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions";


function getOnlineMods() {

	$.getJSON("https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions", function (actions) {
		onlineCount = actions.length
		actions.forEach(action => {
			onlinefiles.push(action)
		});
	});

}


function downloadMasterMods() {
	$.getJSON("https://api.github.com/repos/Discord-Bot-Maker-Mods/DBM-Mods/contents/actions", function (actions) {
		onlineCount = actions.length
		actions.forEach(action => {
			createActionFile(action)
			onlinefiles.push(action)
		})
	});
}



function createActionFile(action) {
	const filepath = path.resolve("mods\\" + action.name);

	const file = fs.createWriteStream(filepath);

	const request = https.get(action.download_url, function (response) {
		response.pipe(file);
	});
}

var calcDataTableHeight = function () {
	return $(window).height() - 155;
};

var calcDataTableWidth = function () {
	return $(window).width();
};

var oTable = $('#modstable').dataTable({
	"bLengthChange": false,
	"bFilter": true,
	"bSort": true,
	"bInfo": false,
	"sScrollY": calcDataTableHeight(),
	"bScrollCollapse": true,
	"paging": false,
	"sScrollX": calcDataTableWidth(),
	"bAutoWidth": false,
	"dom": ' <"search"f><"top"l>rt<"bottom"ip><"clear">'

});

$("#modstable #mods tr").on('click', function (event) {
	$("#modstable #mods tr").removeClass('row_selected');

	var item = $(this).addClass('row_selected').find('td')[0];
	console.log(item.innerHTML);
});

$('.dataTables_scrollBody').css('width', calcDataTableWidth() - 90)
$('.dataTables_scrollBody').css('max-width', calcDataTableWidth() - 90);


$(window).resize(function () {
	$('.dataTables_scrollBody').css('height', calcDataTableHeight());
	$('.dataTables_scrollBody').css('max-height', calcDataTableHeight());

	$('.dataTables_scrollBody').css('width', calcDataTableWidth() - 90)
	$('.dataTables_scrollBody').css('max-width', calcDataTableWidth() - 90);
	oTable.fnDraw();
});