 'use strict';
const sidebar = document.getElementById("sidebar");

// store original page title
const _title = document.title;

// set all pages to display none
const mode_pages = document.getElementsByClassName("mode-page");
for (let j = 0; j < mode_pages.length; j++) {
    mode_pages[j].style.display = "none"; 
}

let active_page_id = settings.has('active_page') ? settings.get('active_page') : "home-mode";

let activePage = document.getElementById(active_page_id);
activePage.style.display = "block";  

if(activePage){
  let active = $(`div[name="${activePage.id}"]`);
  if(active) {
    active.addClass('active');
    
    if(!active.data('slid')){
      active.find('p').slideDown('fast');
      active.data('slid', true);               
    }      
  }  
}

const modes = document.getElementsByClassName("mode");
for (let i = 0; i < modes.length; i++) {

  modes[i].addEventListener("click", function() {
     
    let current = sidebar.getElementsByClassName("active");

    let page = document.getElementById(this.getAttribute("name"));
    
    if(activePage) activePage.style.display = "none";   

    if(current && page){
        current[0].className = current[0].className.replace(" active", "");
    }

    let title = this.getAttribute("name");
    if(page){
      page.style.display = "block";   
      activePage = page;
      title = page.getAttribute("name");

      settings.set('active_page', page.id );
    }            
    this.className += " active"; 
            
    document.getElementById("mode").innerText = title;
    document.title = `${_title} - ${title}`;   
  });
}
