 'use strict'

 function setHomeInfo() {
	const info = require('../data/home_info.json')

	document.getElementById('app_version').innerText = info.app_version;
	const app_info = document.getElementById('app_info');

	info.app_info.forEach(item => {
		const li = document.createElement('li');
		li.innerText = item;

		app_info.appendChild(li);
	});
	
	
	document.getElementById('mods_version').innerText = info.mods_version;
	
	const mod_info = document.getElementById('mods_info');
	info.mod_info.forEach(item => {
		
		const li = document.createElement('li');
		li.innerText = item;

		mod_info.appendChild(li);
	});

	document.getElementById('themes_version').innerText = info.themes_version;

	const theme_info = document.getElementById('themes_info');
	info.theme_info.forEach(item => {
		
		const li = document.createElement('li');
		li.innerText = item;

		theme_info.appendChild(li);
	});



 }

 setHomeInfo();