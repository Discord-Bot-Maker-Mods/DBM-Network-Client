 const electron = require('electron');
 const {
     ipcRenderer
 } = electron;

 const form = document.querySelector('form')
 const mods = document.querySelector('#mods')


 form.addEventListener('submit', submitForm)

 function submitForm(e) {
     e.preventDefault();

     const tr = document.createElement('tr')
     tr.setAttribute('class', 'table-info')

     const name = document.createElement('th')
     name.appendChild(document.createTextNode("Store JSON From WebAPI"))
     name.setAttribute('scope', 'row')
     tr.appendChild(name)

     const section = document.createElement('td')
     section.appendChild(document.createTextNode("JSON Things"))
     tr.appendChild(section)

     const author = document.createElement('td')
     author.appendChild(document.createTextNode("General Wrex"))
     tr.appendChild(author)

     const desc = document.createElement('td')
     desc.appendChild(document.createTextNode("Stores JSON from a webapi into a variable"))
     tr.appendChild(desc)

     mods.appendChild(tr)

 }