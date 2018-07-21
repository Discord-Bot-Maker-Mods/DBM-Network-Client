 'use strict';
const sidebar = document.getElementById("sidebar");

// store original page title
const _title = document.title;

// set all pages to display none
const mode_pages = document.getElementsByClassName("mode-page");
for (var j = 0; j < mode_pages.length; j++) {
    mode_pages[j].style.display = "none"; 
}

let activePage = document.getElementById("home-mode");
activePage.style.display = "block";  

const modes = document.getElementsByClassName("mode");
for (let i = 0; i < modes.length; i++) {

  modes[i].addEventListener("click", function() {
     
    let current = sidebar.getElementsByClassName("active");
    let page = document.getElementById(this.getAttribute("name"));
    
    current[0].className = current[0].className.replace(" active", "");
      
    activePage.style.display = "none";     
    page.style.display = "block";   
    
    this.className += " active"; 
    activePage = page;

    let title = page.getAttribute("name");
    document.getElementById("mode").innerText = title;
    document.title = `${_title} - ${title}`;
  });
  
}
