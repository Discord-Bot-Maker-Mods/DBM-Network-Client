if(process.platform === "win32") {
    document.getElementById("background").style.borderRadius = "30px";
    document.getElementsByTagName("body")[0].style.opacity = 0;
    document.getElementsByTagName("body")[0].style.animation = "anim1 7s ease 3s"
}