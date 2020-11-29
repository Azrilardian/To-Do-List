import "jquery";
import "popper.js";
require("bootstrap");
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
global.jQuery = require("jquery");
import toDoListApp from "./main";
import "../css/style.css";
document.addEventListener("DOMContentLoaded", toDoListApp);
