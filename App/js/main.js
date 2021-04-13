import { STORAGE_TODO, syncWithLocalStorage } from "./local-storage";
import sideBarActivation from "./sidebar";
function toDoListApp() {
	const input = document.querySelector(".input input");
	const btnCreateList = document.querySelector(".buat-list");
	const container = document.querySelector(".container");
	const btnCreatingList = document.querySelector(".list-create-btn");
	const iconCloseList = document.querySelector(".close-icon");
	const listContainer = document.querySelector(".list-container");
	const listColors = document.querySelectorAll(".color span");
	let colorName = "#ffffff";
	let colors = {
		yellow: "#f0ffb4",
		green: "#b0ffc8",
		blue: "#b8e1ff",
		red: "#ffc6c6",
		black: "#b6b6b6",
		white: "#ffffff6c",
	};
	let listArr = [];
	let listCanEdit = true;
	let statusUpdate;

	sideBarActivation();

	// Get Data
	const List = function (listText, color, status = "uncompleted") {
		this.listText = listText;
		this.color = color;
		this.status = status;
	};

	document.querySelector(".date p").textContent = new Date().toDateString();

	/*
	======================================================================================================
	==========  STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA TOMBOL BUAT LIST DIKLIK  =================== 
	======================================================================================================
	*/

	btnCreatingList.addEventListener("click", () => showCreatingList());

	const showCreatingList = () => {
		const animationDurationEnd = 300;
		btnCreatingList.classList.add("show");
		setTimeout(() => {
			btnCreatingList.children[0].classList.add("show");
			btnCreatingList.children[1].classList.add("show");
			setTimeout(() => input.focus(), 0);
		}, animationDurationEnd);
		btnCreatingList.children[2].classList.add("hide");
	};

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
		listArr.push(new List(input.value, colorName));
		showList(listArr);
		syncWithLocalStorage("ADD", input.value, colorName);
		closeList();
	};

	const showList = (lists) => {
		listContainer.textContent = "";
		listContainer.classList.remove("nothing-list");
		lists.map((ls) => listContainer.insertAdjacentHTML("beforeend", list(ls)));
	};

	const list = (list) => {
		return `
		<div class="list ${list.color} ${list.status}" style="background-color: ${list.color}">
			<p>${list.listText}</p>
			<input>
			<span>
				<i class="lnr lnr-pencil edit"></i>
				<i class="lnr lnr-trash remove"></i>
			</span>
		</div>`;
	};

	const closeList = () => {
		input.value = "";
		btnCreatingList.classList.remove("show");
		btnCreatingList.children[0].classList.remove("show");
		btnCreatingList.children[1].classList.remove("show");
		btnCreatingList.children[2].classList.remove("hide");
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
		const userClickedList = list.classList.contains("list");
		const listStatusUncompleted = list.classList.contains("uncompleted");
		const listStatusCompleted = list.classList.contains("completed");

		if (userClickedList) {
			const listDisplayText = list.children[0].textContent.trim();
			if (listStatusUncompleted) listUncompletedStyled(list);
			if (listStatusCompleted) listCompletedStyled(list);
			updateDataWhenListClicked(listDisplayText);
		}
	});

	function updateDataWhenListClicked(listDisplayText) {
		const listClicked = listArr.find((ls) => ls.listText === listDisplayText);
		const { listText, warna } = listClicked;
		listArr.find((list) => (list.listText === listDisplayText ? (list.status = statusUpdate) : list.status));
		syncWithLocalStorage("UPDATE", listText, warna, statusUpdate);
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
		let list = target.parentElement.parentElement; // get .list
		list.classList.add("remove");
		list.addEventListener("transitionend", () => list.remove());
		let listDisplayText = list.children[0].textContent.trim();
		updateDataWhenListRemove(listDisplayText);
		addImgWhenListNothing();
		syncWithLocalStorage("DELETE", listDisplayText);
	}

	function updateDataWhenListRemove(listDisplayText) {
		let listArrUpdate = [];
		listArr.filter((list) => (list.listText !== listDisplayText ? listArrUpdate.push(list) : listArrUpdate));
		listArr = listArrUpdate;
	}

	function addImgWhenListNothing() {
		if (listArr.length !== 0) return listContainer.classList.remove("nothing-list");
		listContainer.classList.add("nothing-list");
		listContainer.innerHTML = `<img src="../App/img/undraw_complete_task.svg" alt="nothing-list" />`;
	}
	addImgWhenListNothing();

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

	const aktifasiOption = () => {
		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("opt-selected")) {
				const filter = e.target;
				filter.nextElementSibling.classList.toggle("active");
			} else if (e.target.classList.contains("opt-select")) {
				const opt = e.target;
				opt.parentElement.previousElementSibling.textContent = opt.textContent;
				opt.parentElement.classList.remove("active");
			} else {
				const optGroup = document.querySelectorAll(".opt-group");
				optGroup.forEach((group) => group.classList.remove("active"));
			}
		});
	};

	aktifasiOption();

	const urutkanList = () => {
		let status = "Semua";
		const kategori1 = document.querySelectorAll("#kategori1");
		const kategori2 = document.querySelectorAll("#kategori2");
		kategori1.forEach((e) => e.addEventListener("click", (event) => fillterCompletedUncompleted(event.target)));
		kategori2.forEach((e) => e.addEventListener("click", (event) => fillterByColor(event.target)));

		function fillterCompletedUncompleted(target) {
			switch (target.textContent) {
				case "Semua":
					showList(listArr);
					status = "Semua";
					break;
				case "Selesai":
					let listSelesai = listArr.filter((list) => list.status == "completed");
					showList(listSelesai);
					status = "Selesai";
					break;
				case "Belum Selesai":
					let listBelumSelesai = listArr.filter((list) => list.status == "uncompleted");
					showList(listBelumSelesai);
					status = "Belum Selesai";
					break;
			}
		}

		function fillterByColor(target) {
			if (status == "Semua" && target.textContent == "Semua Warna") showList(listArr);
			else if (status == "Semua") {
				let semuaListFilter;
				const filterList = (warnaList) => listArr.filter((list) => list.warna == warnaList);
				if (target.textContent == "Semua Warna") return;
				if (target.textContent == "Kuning") semuaListFilter = filterList("#f0ffb4");
				if (target.textContent == "Hijau") semuaListFilter = filterList("#b0ffc8");
				if (target.textContent == "Biru") semuaListFilter = filterList("#b8e1ff");
				if (target.textContent == "Merah") semuaListFilter = filterList("#ffc6c6");
				if (target.textContent == "Hitam") semuaListFilter = filterList("#b6b6b6");
				if (target.textContent == "Putih") semuaListFilter = filterList("#ffffff");
				showList(semuaListFilter);
			} else if (status == "Selesai") {
				let semuaListFilter;
				const filterList = (statusList, warnaList) => listArr.filter((list) => list.status == statusList && list.warna == warnaList);
				if (target.textContent == "Semua Warna") semuaListFilter = listArr.filter((list) => list.status == "completed");
				if (target.textContent == "Kuning") semuaListFilter = filterList("completed", "#f0ffb4");
				if (target.textContent == "Hijau") semuaListFilter = filterList("completed", "#b0ffc8");
				if (target.textContent == "Biru") semuaListFilter = filterList("completed", "#b8e1ff");
				if (target.textContent == "Merah") semuaListFilter = filterList("completed", "#ffc6c6");
				if (target.textContent == "Hitam") semuaListFilter = filterList("completed", "#b6b6b6");
				if (target.textContent == "Putih") semuaListFilter = filterList("completed", "#ffffff");
				showList(semuaListFilter);
			} else if (status == "Belum Selesai") {
				let semuaListFilter;
				const filterList = (statusList, warnaList) => listArr.filter((list) => list.status == statusList && list.warna == warnaList);
				if (target.textContent == "Semua Warna") semuaListFilter = listArr.filter((list) => list.status == "uncompleted");
				if (target.textContent == "Kuning") semuaListFilter = filterList("uncompleted", "#f0ffb4");
				if (target.textContent == "Hijau") semuaListFilter = filterList("uncompleted", "#b0ffc8");
				if (target.textContent == "Biru") semuaListFilter = filterList("uncompleted", "#b8e1ff");
				if (target.textContent == "Merah") semuaListFilter = filterList("uncompleted", "#ffc6c6");
				if (target.textContent == "Hitam") semuaListFilter = filterList("uncompleted", "#b6b6b6");
				if (target.textContent == "Putih") semuaListFilter = filterList("uncompleted", "#ffffff");
				showList(semuaListFilter);
			}
		}
	};
	urutkanList();

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
			const [isiList, warna, status] = todos[key]; // Destructuring value
			listArr.push(new List(isiList, warna, status)); // Isi kembali array semuaList
			showList(listArr);
			syncWithLocalStorage("ADD", isiList, warna, status);
		}
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/
}

export default toDoListApp;
