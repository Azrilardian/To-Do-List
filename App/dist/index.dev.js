"use strict";

require("jquery");

var _main = _interopRequireDefault(require("./js/main.js"));

require("../css/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

global.jQuery = require("jquery");
document.addEventListener("DOMContentLoaded", _main["default"]);