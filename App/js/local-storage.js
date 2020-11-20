const STORAGE_TODO = "STORAGE TODO";
let todos = {};
function syncWithLocalStorage(activity, item, color, status = "uncompleted") {
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

export { STORAGE_TODO, syncWithLocalStorage };
