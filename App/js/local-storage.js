const STORAGE_TODO = "STORAGE TODO";
let todos = {};
function syncWithLocalStorage(activity, item, status = false, color, classColor) {
    switch (activity) {
        case "ADD":
        case "UPDATE":
            todos[item] = [status, color, classColor];
            break;
        case "DELETE":
            delete todos[item];
            break;
        default:
            break;
    };
    localStorage.setItem(STORAGE_TODO, JSON.stringify(todos));
    return;
};

export {STORAGE_TODO, syncWithLocalStorage};