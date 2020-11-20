"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncWithLocalStorage = syncWithLocalStorage;
exports.STORAGE_TODO = void 0;
var STORAGE_TODO = "STORAGE TODO";
exports.STORAGE_TODO = STORAGE_TODO;
var todos = {};

function syncWithLocalStorage(activity, item, color) {
  var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "uncompleted";

  switch (activity) {
    case "ADD":
    case "UPDATE":
      todos[item] = [item, color, status];
      break;

    case "DELETE":
      delete todos[item];
      break;

    default:
      break;
  }

  localStorage.setItem(STORAGE_TODO, JSON.stringify(todos));
  return;
}