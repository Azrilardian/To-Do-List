"use strict";

var sideBarActivation = function sideBarActivation() {
  var sideBar = document.querySelector(".side-bar");
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("burger-open")) sideBar.classList.add("active");else if (e.target.classList.contains("burger-close")) sideBar.classList.remove("active");else if (e.target.classList.contains("side-bar")) return;else {
      sideBar.classList.remove("active");
    }
  });
};

sideBarActivation();