import moment from "moment";
function toDoListApp() {
	//! Variabel
	const create = document.querySelector(".create");
	const input = document.querySelector(".input input");
	const btnShowInput = document.querySelector(".left button");
	const closeIcon = document.querySelector(".create header p");
	const btnCreateList = document.querySelector("#create");
	const listColor = document.querySelectorAll(".color span");
	let colorName = "white";

	//! Listener

	//? On Button createList Click
	btnShowInput.addEventListener("click", () => showInputAlert(create, input));

	input.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			createList(input.value);
			closeList(create, input);
		}
	});

	//? On Button addList Click
	btnCreateList.addEventListener("click", () => {
		createList(input.value);
		closeList(create, input);
	});
	listColor.forEach((color) =>
		color.addEventListener("click", function () {
			changeListColor(color);
		})
	);

	//? On Button Close Icon Click
	closeIcon.addEventListener("click", () => closeList(create, input));

	//? Document Listener
	document.addEventListener("click", (e) => {
		const target = e.target;
		if (target.classList.contains("list")) {
			const status = target.classList.toggle("completed");
			syncWithLocalStorage("UPDATE", target.innerText, status);
		}
		if (target.classList.contains("fa-trash")) removeList(target);
		if (target.id == "kategori1") fillterCompletedUncompleted(e);
		if (target.id == "kategori2") fillterByColor(e);
	});

	//! Function

	const showInputAlert = (e, i) => {
		e.classList.toggle("active");
		setTimeout(() => i.focus(), 15);
	};

	function createList(inputValue, status) {
		if (inputValue === "") return;
		else {
			const listContainer = document.querySelector(".list-container");
			let isDone = status ? "completed" : "";
			listContainer.innerHTML += list(inputValue, isDone);
			syncWithLocalStorage("ADD", inputValue, status);
		}
	}

	function closeList(create, input) {
		create.classList.remove("active");
		input.value = "";
	}

	function removeList(target) {
		let list = target.parentElement.parentElement;
		list.classList.add("remove");
		list.addEventListener("transitionend", () => list.remove());
		syncWithLocalStorage("DELETE", list.innerText.trim());
	}

	function list(e, status) {
		return `
		<div class="list ${colorName} ${status}" style="background-color=${input.style.backgroundColor}">
			<p>${e}</p>
			<span>${getDate()}</span>
			<span>
				<i class="fas fa-pen"></i>
				<i class="fas fa-trash"></i>
			</span>
		</div>`;
	}

	function fillterCompletedUncompleted(e) {
		const lists = document.querySelectorAll(".list");
		lists.forEach((list) => {
			switch (e.target.value) {
				case "Semua":
					list.style.display = "flex";
					break;
				case "Selesai":
					list.classList.contains("completed") ? (list.style.display = "flex") : (list.style.display = "none");
					break;
				case "Belum Selesai":
					!list.classList.contains("completed") ? (list.style.display = "flex") : (list.style.display = "none");
					break;
			}
		});
	}

	function fillterByColor(e) {
		const lists = document.querySelectorAll(".list");

		function cekClass(list, className) {
			list.classList.contains(className) ? (list.style.display = "flex") : (list.style.display = "none");
		}

		lists.forEach((list) => {
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
		const colorId = color.id;
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
		for (let i = 0; i < listColor.length; i++) listColor[i].classList.remove("active");
		color.classList.add("active");
	}

	function getDate() {
		const pForDate = document.querySelector(".date p");
		const today = moment().startOf("hour").fromNow();
		pForDate.textContent = today;
		return today;
	}
	getDate();

	//? Create a localStorage

	const STORAGE_TODO = "STORAGE TODO";
	let todos = {};
	function syncWithLocalStorage(activity, item, status = false) {
		switch (activity) {
			case "ADD":
			case "UPDATE":
				todos[item] = status;
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

	const todoFromLocal = localStorage.getItem(STORAGE_TODO);
	if (todoFromLocal) {
		const todos = JSON.parse(todoFromLocal);
		for (let key in todos) {
			createList(key, todos[key]);
		}
	}
}
toDoListApp();
