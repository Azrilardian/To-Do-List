"use strict";

require("jquery");

require("popper.js");

require("../../node_modules/bootstrap/dist/css/bootstrap.min.css");

var _main = _interopRequireDefault(require("./main"));

require("../css/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("bootstrap");

global.jQuery = require("jquery");
document.addEventListener("DOMContentLoaded", _main["default"]);