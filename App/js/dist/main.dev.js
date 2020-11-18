"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _localStorage = require("./local-storage.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function toDoListApp() {
  //! Variabel
  var create = document.querySelector(".create");
  var input = document.querySelector(".input input");
  var btnShowInput = document.querySelector(".left button");
  var closeIcon = document.querySelector(".create header p");
  var btnCreateList = document.querySelector("#create");
  var listColor = document.querySelectorAll(".color span");
  var colorName = "white"; //! Listener
  //? On Button createList Click

  btnShowInput.addEventListener("click", function () {
    return showInputAlert(create, input);
  });
  input.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      createList(input.value);
      closeList(create, input);
    }
  }); //? On Button addList Click

  btnCreateList.addEventListener("click", function () {
    createList(input.value);
    closeList(create, input);
  });
  listColor.forEach(function (color) {
    return color.addEventListener("click", function () {
      changeListColor(color);
    });
  }); //? On Button Close Icon Click

  closeIcon.addEventListener("click", function () {
    return closeList(create, input);
  }); //? Document Listener

  document.addEventListener("click", function (e) {
    var target = e.target;

    if (target.classList.contains("list")) {
      var status = target.classList.toggle("completed");
      var _color = target.style.backgroundColor;
      (0, _localStorage.syncWithLocalStorage)("UPDATE", target.innerText, status, _color);
    }

    if (target.classList.contains("fa-trash")) removeList(target);
    if (target.id == "kategori1") fillterCompletedUncompleted(e);
    if (target.id == "kategori2") fillterByColor(e);
  }); //! Function

  var showInputAlert = function showInputAlert(e, i) {
    e.classList.toggle("active");
    setTimeout(function () {
      return i.focus();
    }, 15);
  };

  function createList(inputValue, status) {
    var toDoColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : color();
    var colorNameClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : colorName;
    if (inputValue === "") return;else {
      var listContainer = document.querySelector(".list-container");
      var isDone = status ? "completed" : "";
      listContainer.innerHTML += list(inputValue, isDone, toDoColor, colorNameClass);
      (0, _localStorage.syncWithLocalStorage)("ADD", inputValue, status, toDoColor, colorNameClass);
    }
  }

  function closeList(create, input) {
    create.classList.remove("active");
    input.value = "";
  }

  function removeList(target) {
    var list = target.parentElement.parentElement;
    list.classList.add("remove");
    list.addEventListener("transitionend", function () {
      return list.remove();
    });
    (0, _localStorage.syncWithLocalStorage)("DELETE", list.innerText.trim());
  }

  function color() {
    return input.style.backgroundColor;
  }

  function list(e, status, color, colorNameClass) {
    return "\n\t\t<div class=\"list ".concat(colorNameClass, " ").concat(status, "\" style=\"background-color: ").concat(color, "\">\n\t\t\t<p>").concat(e, "</p>\n\t\t\t<span>").concat(getDate(), "</span>\n\t\t\t<span>\n\t\t\t\t<i class=\"fas fa-pen\"></i>\n\t\t\t\t<i class=\"fas fa-trash\"></i>\n\t\t\t</span>\n\t\t</div>");
  }

  function fillterCompletedUncompleted(e) {
    var lists = document.querySelectorAll(".list");
    lists.forEach(function (list) {
      switch (e.target.value) {
        case "Semua":
          list.style.display = "flex";
          break;

        case "Selesai":
          list.classList.contains("completed") ? list.style.display = "flex" : list.style.display = "none";
          break;

        case "Belum Selesai":
          !list.classList.contains("completed") ? list.style.display = "flex" : list.style.display = "none";
          break;
      }
    });
  }

  function fillterByColor(e) {
    var lists = document.querySelectorAll(".list");

    function cekClass(list, className) {
      list.classList.contains(className) ? list.style.display = "flex" : list.style.display = "none";
    }

    lists.forEach(function (list) {
      switch (e.target.value) {
        case "Berdasarkan Warna":
          list.style.display = "flex";
          break;

        case "Kuning":
          cekClass(list, "yellow");
          break;

        case "Hijau":
          cekClass(list, "green");
          break;

        case "Biru":
          cekClass(list, "blue");
          break;

        case "Hitam":
          cekClass(list, "black");
          break;

        case "Abu - abu":
          cekClass(list, "grey");
          break;

        case "Putih":
          cekClass(list, "white");
          break;
      }
    });
  }

  function changeListColor(color) {
    var colorId = color.id;

    switch (colorId) {
      case "yellow":
        input.style.backgroundColor = "#ffffa9";
        colorName = "yellow";
        input.focus();
        break;

      case "green":
        input.style.backgroundColor = "#b4ffb4";
        colorName = "green";
        input.focus();
        break;

      case "blue":
        input.style.backgroundColor = "#a3ceff";
        colorName = "blue";
        input.focus();
        break;

      case "black":
        input.style.backgroundColor = "#6d6d6d";
        colorName = "black";
        input.focus();
        break;

      case "grey":
        input.style.backgroundColor = "#d3d3d3";
        colorName = "grey";
        input.focus();
        break;

      case "white":
        input.style.backgroundColor = "#ffffff";
        colorName = "white";
        input.focus();
        break;
    }

    for (var i = 0; i < listColor.length; i++) {
      listColor[i].classList.remove("active");
    }

    color.classList.add("active");
  }

  function getDate() {
    var pForDate = document.querySelector(".date p");
    var today = (0, _moment["default"])().startOf("hour").fromNow();
    pForDate.textContent = today;
    return today;
  }

  getDate(); //? Get Todo and Create

  var todoFromLocal = localStorage.getItem(_localStorage.STORAGE_TODO);

  if (todoFromLocal) {
    var todos = JSON.parse(todoFromLocal);

    for (var key in todos) {
      createList(key, todos[key][0], todos[key][1], todos[key][2]);
    }
  }
}

var _default = toDoListApp;
exports["default"] = _default;