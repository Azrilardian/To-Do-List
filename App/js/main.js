import { STORAGE_TODO, syncWithLocalStorage } from "./local-storage";
import sideBarActivation from "./sidebar";
function toDoListApp() {
	const input = document.querySelector(".input input");
	const btnCreateList = document.querySelector(".buat-list");
	const container = document.querySelector(".container");
	const btnCreatingList = document.querySelector(".list-create-btn");
	const iconCloseList = document.querySelector(".fa-close");
	const listContainer = document.querySelector(".list-container");
	const listColors = document.querySelectorAll(".color span");
	let optionStatusSelected = document.querySelector(".one .opt-selected");
	let optionColorSelected = document.querySelector(".two .opt-selected");
	let colorName = "#7e7e7e2d";
	let colors = {
		Yellow: "#d5dd5e33",
		Green: "#479e9828",
		Blue: "#5da5e428",
		Red: "#e46b672d",
		Purple: "#e46c8c2c",
		Grey: "#7e7e7e2d",
	};
	let listArr = [];
	let listCanEdit = true;
	let statusUpdate;

	sideBarActivation();

	// Get Data
	const List = function (listText, color, id, status = "uncompleted") {
		this.listText = listText;
		this.color = color;
		this.status = status;
		this.id = id;
	};

	document.querySelector(".date").textContent = `${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`;

	/*
	======================================================================================================
	==========  STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA TOMBOL BUAT LIST DIKLIK  =================== 
	======================================================================================================
	*/

	btnCreatingList.addEventListener("click", () => showCreatingList());

	const showCreatingList = () => {
		const animationDurationEnd = 200;
		btnCreatingList.classList.add("show");
		setTimeout(() => {
			btnCreatingList.children[0].classList.add("show");
			btnCreatingList.children[1].classList.add("show");
			setTimeout(() => input.focus(), 0);
		}, animationDurationEnd);
		btnCreatingList.children[2].classList.add("hide");
	};

	// showCreatingList();
	// Enter Trigger
	input.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) createList();
	});

	btnCreateList.addEventListener("click", (e) => {
		e.stopPropagation();
		createList();
	});

	const createList = () => {
		if (input.value === "") return;
		listArr.push(new List(input.value, colorName, Math.random()));
		filterListBasedOnStatus(optionStatusSelected.textContent);
		filterListBasedOnColor(optionColorSelected.textContent);
		syncWithLocalStorage("ADD", input.value, colorName, Math.random());
		closeList();
	};

	function filterListBasedOnStatus(filterStatus) {
		const optionGroup = document.getElementById("status-category");
		if (filterStatus === "Semua") showList(allList(optionColorSelected.textContent));
		else if (filterStatus === "Selesai") showList(completedList(optionColorSelected.textContent));
		else {
			showList(uncompletedList(optionColorSelected.textContent));
		}
		optionStatusSelected.textContent = filterStatus;
		optionGroup.classList.remove("show");
		addImgWhenListNothing();
	}

	function filterListBasedOnColor(filterStatus) {
		const optionGroup = document.getElementById("color-category");
		if (optionStatusSelected.textContent === "Semua") showList(allList(filterStatus));
		else if (optionStatusSelected.textContent === "Selesai") showList(completedList(filterStatus));
		else {
			showList(uncompletedList(filterStatus));
		}
		optionColorSelected.textContent = filterStatus;
		optionGroup.classList.remove("show");
		addImgWhenListNothing();
	}

	function addImgWhenListNothing() {
		const list = document.querySelector(".list");
		if (list === null) {
			listContainer.classList.add("nothing-list");
			listContainer.innerHTML = `<img src="../App/img/undraw_complete_task.svg" alt="nothing-list" />`;
		}
	}
	addImgWhenListNothing();

	function allList(optionColorSelected) {
		if (optionColorSelected === "Semua Warna") return listArr.filter((list) => list.status === "completed" || list.status === "uncompleted");
		return listArr.filter((list) => (list.status === "completed" || list.status === "uncompleted") && list.color === colors[optionColorSelected]);
	}

	function completedList(optionColorSelected) {
		if (optionColorSelected === "Semua Warna") return listArr.filter((list) => list.status === "completed");
		return listArr.filter((list) => list.status === "completed" && list.color === colors[optionColorSelected]);
	}

	function uncompletedList(optionColorSelected) {
		if (optionColorSelected === "Semua Warna") return listArr.filter((list) => list.status === "uncompleted");
		return listArr.filter((list) => list.status === "uncompleted" && list.color === colors[optionColorSelected]);
	}

	const showList = (lists) => {
		listContainer.textContent = "";
		listContainer.classList.remove("nothing-list");
		lists.map((ls) => listContainer.insertAdjacentHTML("beforeend", list(ls)));
	};

	const list = (list) => {
		return `
		<div class="list col-lg-6 col-sm-12 col-md-12 col-12">
			<div class="margin my-2 ${list.color} ${list.status}" style="background-color: ${list.color}" id=${list.id}>
				<p>${list.listText}</p>
				<input>
				<span>
					<i class="lnr lnr-pencil edit"></i>
					<i class="lnr lnr-trash remove"></i>
				</span>
			</div>
		</div>`;
	};

	const closeList = () => {
		input.value = "";
		btnCreatingList.children[0].classList.remove("show");
		btnCreatingList.children[1].classList.remove("show");
		btnCreatingList.children[2].classList.remove("hide");
		btnCreatingList.classList.remove("show");
	};

	iconCloseList.addEventListener("click", (e) => {
		e.stopPropagation();
		closeList();
	});

	listColors.forEach((color) =>
		color.addEventListener("click", () => {
			changeColor(color.id);
			addBorderWhenUserClickColor(color);
		})
	);

	function changeColor(color) {
		input.style.backgroundColor = colors[color];
		color === colorName ? (colorName = "#ffffff") : (colorName = colors[color]);
		input.focus();
	}

	function addBorderWhenUserClickColor(color) {
		Array.from(listColors).map((clr) => clr.classList.remove("active"));
		color.classList.add("active");
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	==========    STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA TOMBOL LIST DI KLIK    =================== 
	======================================================================================================
	*/

	listContainer.addEventListener("click", (e) => {
		const list = e.target;
		const userClickedList = list.classList.contains("margin");
		const listStatusUncompleted = list.classList.contains("uncompleted");
		const listStatusCompleted = list.classList.contains("completed");
		if (userClickedList) {
			const listDisplayText = list.children[0].textContent.trim();
			if (listStatusUncompleted) listUncompletedStyled(list);
			if (listStatusCompleted) listCompletedStyled(list);
			updateDataWhenListClicked(listDisplayText, list.id);
			filterListBasedOnStatus(optionStatusSelected.textContent);
		}
	});

	function updateDataWhenListClicked(listDisplayText, listId) {
		listArr.filter((list) => (list.listText == listDisplayText && list.id == listId ? (list.status = statusUpdate) : list.status));
		const listClicked = listArr.find((ls) => ls.listText == listDisplayText && ls.id == listId);
		const { listText, color, id } = listClicked;
		syncWithLocalStorage("UPDATE", listText, color, id, statusUpdate);
	}

	function listUncompletedStyled(target) {
		target.classList.add("completed");
		target.classList.remove("uncompleted");
		statusUpdate = "completed";
		listCanEdit = false;
	}

	function listCompletedStyled(target) {
		target.classList.remove("completed");
		target.classList.add("uncompleted");
		statusUpdate = "uncompleted";
		listCanEdit = true;
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	==========      STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN FITUR PADA LIST      ===================
	======================================================================================================
	*/

	listContainer.addEventListener("click", (e) => {
		const button = e.target;
		const userClickedRemoveBtn = button.classList.contains("remove");
		const userClickedEditBtn = button.classList.contains("edit");
		if (userClickedRemoveBtn) removeList(button);
		if (userClickedEditBtn) {
			if (!listCanEdit) return;
			editList(button);
		}
	});

	function removeList(target) {
		let list = target.parentElement.parentElement.parentElement; // get .list
		list.classList.add("remove");
		list.addEventListener("transitionend", () => {
			list.remove();
			addImgWhenListNothing();
		});
		let listDisplayText = list.children[0].textContent.trim();
		updateDataWhenListRemove(listDisplayText);
		syncWithLocalStorage("DELETE", listDisplayText);
	}

	function updateDataWhenListRemove(listDisplayText) {
		let listArrUpdate = [];
		listArr.filter((list) => (list.listText !== listDisplayText ? listArrUpdate.push(list) : listArrUpdate));
		listArr = listArrUpdate;
	}

	function editList(target) {
		const list = target.parentElement.parentElement; // get .list
		let listText = list.children[0].textContent.trim();
		const input = list.children[1];
		input.classList.add("show");
		list.children[0].textContent = "";
		input.focus();
		input.value = listText;

		// Enter trigger
		input.addEventListener("keyup", (e) => {
			if (e.keyCode === 13) {
				list.children[0].textContent = input.value;
				updateDataWhenListEdit(listText, input.value);
				input.classList.remove("show");
			}
		});
	}

	function updateDataWhenListEdit(listTextBefore, listTextAfter) {
		const list = listArr.find((list) => {
			if (list.listText === listTextBefore) {
				list.listText = listTextAfter;
				return list;
			}
		});

		const { listText, color, status } = list;
		syncWithLocalStorage("DELETE", listTextBefore);
		syncWithLocalStorage("UPDATE", listText, color, status);
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	==========          STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN OPTION           ===================
	======================================================================================================
	*/

	document.addEventListener("click", (e) => {
		let userClickCategory = e.target.classList.contains("opt-selected");
		let userClickCategoryOption = e.target.classList.contains("opt-select");
		let optionGroup;
		if (userClickCategory) {
			optionGroup = e.target.nextElementSibling;
			optionGroup.classList.toggle("show");
		} else if (userClickCategoryOption) {
			const categoryOption = e.target;
			const optionIsStatusCategory = categoryOption.parentElement.id === "status-category";
			const optionIsColorCategory = categoryOption.parentElement.id === "color-category";
			if (optionIsStatusCategory) filterListBasedOnStatus(categoryOption.textContent);
			if (optionIsColorCategory) filterListBasedOnColor(categoryOption.textContent);
		} else {
			optionGroup = document.querySelectorAll(".opt-group");
			optionGroup.forEach((group) => group.classList.remove("show"));
		}
	});

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	=============    STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN LOCAL STORAGAE    =====================
	======================================================================================================
	*/

	//? Get Todo and Create
	const todoFromLocal = localStorage.getItem(STORAGE_TODO);
	if (todoFromLocal) {
		const todos = JSON.parse(todoFromLocal);
		for (let key in todos) {
			const [listText, color, id, status] = todos[key]; // Destructuring value
			listArr.push(new List(listText, color, id, status)); // Isi kembali array semuaList
			showList(listArr);
			syncWithLocalStorage("ADD", listText, color, id, status);
		}
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/
}

export default toDoListApp;
