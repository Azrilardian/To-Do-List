import moment from "moment";
import { STORAGE_TODO, syncWithLocalStorage } from "./local-storage.js";
function toDoListApp() {
	const create = document.querySelector(".create");
	const input = document.querySelector(".input input");
	const btnTampilkanListContainer = document.querySelector(".left button");
	const right = document.querySelector(".right");
	const listColor = document.querySelectorAll(".color span");
	let colorName = "#ffffff";
	let semuaList = [];
	let listEdit = true;

	// Get Data
	const List = function (isiList, warna, status = "uncompleted") {
		this.isiList = isiList;
		this.warna = warna;
		this.status = status;
	};

	/*
	======================================================================================================
	==========  STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA TOMBOL BUAT LIST DIKLIK  =================== 
	======================================================================================================
	*/

	btnTampilkanListContainer.addEventListener("click", () => tampilkanListContainer());
	document.querySelector(".date p").textContent = moment().startOf("hour").fromNow();

	const tampilkanListContainer = () => {
		create.classList.toggle("active");
		setTimeout(() => input.focus(), 100);
	};

	// Enter Trigger
	input.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			createList();
		}
	});

	// Create List
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("list")) return;
		else if (e.target.classList.contains("buat-list")) {
			createList();
		} else if (e.target.classList.contains("close-icon") || e.target.classList.contains("right")) {
			closeList();
		}
	});

	const btnList = (e) => {
		return `
		<div class="list ${e.warna} ${e.status}" style="background-color: ${e.warna}">
			<p>${e.isiList}</p>
			<input>
			<span class="date">${moment().startOf("hour").fromNow()}</span>
			<span>
				<i class="lnr lnr-pencil edit"></i>
				<i class="lnr lnr-trash hapus"></i>
			</span>
		</div>`;
	};

	const tampilkanSemuaList = (arr) => {
		const listContainer = document.querySelector(".list-container");
		listContainer.textContent = "";
		arr.map((e) => {
			const button = btnList(e);
			listContainer.insertAdjacentHTML("beforeend", button);
		});
	};

	const createList = () => {
		if (input.value === "") return;
		else {
			semuaList.push(new List(input.value, colorName));
			tampilkanSemuaList(semuaList);
			syncWithLocalStorage("ADD", input.value, colorName);
		}
		closeList();
	};

	const closeList = () => {
		create.classList.remove("active");
		input.value = "";
	};

	const changeListColor = (color) => {
		const colorId = color.id;
		switch (colorId) {
			case "yellow":
				input.style.backgroundColor = "#ffffa9";
				colorName = "#ffffa9";
				input.focus();
				break;
			case "green":
				input.style.backgroundColor = "#b4ffb4";
				colorName = "#b4ffb4";
				input.focus();
				break;
			case "blue":
				input.style.backgroundColor = "#a3ceff";
				colorName = "#a3ceff";
				input.focus();
				break;
			case "black":
				input.style.backgroundColor = "#6d6d6d";
				colorName = "#6d6d6d";
				input.focus();
				break;
			case "grey":
				input.style.backgroundColor = "#d3d3d3";
				colorName = "#d3d3d3";
				input.focus();
				break;
			case "white":
				input.style.backgroundColor = "#ffffff";
				colorName = "#ffffff";
				input.focus();
				break;
		}
		for (let i = 0; i < listColor.length; i++) listColor[i].classList.remove("active");
		color.classList.add("active");
	};

	listColor.forEach((color) =>
		color.addEventListener("click", () => {
			changeListColor(color);
		})
	);

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

	//? Document Listener
	document.addEventListener("click", (e) => {
		const target = e.target;
		if (target.classList.contains("list")) {
			const isiListDOM = target.children[0].textContent.trim();
			const list = semuaList.find((list) => list.isiList == isiListDOM);
			const { isiList, warna } = list;
			let statusUpdate;

			// Ketika list di klik pada saat belum selesai
			if (target.classList.contains("uncompleted")) {
				target.classList.add("completed");
				target.classList.remove("uncompleted");
				statusUpdate = "completed";
				listEdit = false;
				// Ketika list di klik pada saat sudah selesai
			} else {
				target.classList.remove("completed");
				target.classList.add("uncompleted");
				statusUpdate = "uncompleted";
				listEdit = true;
			}

			semuaList.find((list) => {
				if (list.isiList == isiListDOM) list.status = statusUpdate;
			});
			syncWithLocalStorage("UPDATE", isiList, warna, statusUpdate);
		}
	});

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

	const removeList = (target) => {
		// Hapus List pada DOM
		let listDOM = target.parentElement.parentElement; // Ambil .list
		// Animasi saat dihapus
		listDOM.classList.add("remove");
		listDOM.addEventListener("transitionend", () => listDOM.remove());

		// Hapus List pada array semuaList
		let isiListDOM = listDOM.children[0].textContent.trim();
		let listUpdate = [];
		semuaList.filter((list) => (list.isiList != isiListDOM ? listUpdate.push(list) : (listUpdate = listUpdate)));
		semuaList = listUpdate; // Reasiggn Ulang semuaList

		// Hapus List pada Local Storage
		syncWithLocalStorage("DELETE", isiListDOM);
	};

	const editList = (target) => {
		const inputActivation = (target) => {
			const isiList = target.parentElement.parentElement.children[0].textContent.trim();
			const inputInList = target.parentElement.parentElement.children[1];
			inputInList.classList.add("active");
			inputInList.focus();
			inputInList.value = isiList;
			target.parentElement.parentElement.children[0].textContent = "";

			// Enter trigger
			inputInList.addEventListener("keyup", (e) => {
				if (e.keyCode === 13) {
					sinkronListPadaSemuaList(isiList, inputInList.value);
					inputInList.classList.remove("active");
				}
			});
		};
		inputActivation(target);

		// Sinkron dengan semuaList
		const sinkronListPadaSemuaList = (isiListSebelum, isiListSesudah) => {
			const list = semuaList.filter((list) => {
				if (list.isiList == isiListSebelum) {
					list.isiList = isiListSesudah;
					target.parentElement.parentElement.children[0].textContent = isiListSesudah;
					return list;
				}
			});
			const { isiList, warna, status } = list[0];

			syncWithLocalStorage("DELETE", isiListSebelum);
			syncWithLocalStorage("UPDATE", isiList, warna, status);
		};
	};

	right.addEventListener("click", (e) => {
		const target = e.target;
		if (target.classList.contains("hapus")) removeList(target);
		if (target.classList.contains("edit")) {
			if (listEdit == true) editList(target);
			else if (listEdit == false) return;
		}
	});

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

	const urutkanList = () => {
		let status = "Semua";
		right.addEventListener("click", (e) => {
			const target = e.target;
			if (target.id == "kategori1") fillterCompletedUncompleted(target);
			if (target.id == "kategori2") fillterByColor(target);
		});

		function fillterCompletedUncompleted(target) {
			switch (target.value) {
				case "Semua":
					tampilkanSemuaList(semuaList);
					break;
				case "Selesai":
					let listSelesai = semuaList.filter((list) => list.status == "completed");
					tampilkanSemuaList(listSelesai);
					status = "Selesai";
					break;
				case "Belum Selesai":
					let listBelumSelesai = semuaList.filter((list) => list.status == "uncompleted");
					tampilkanSemuaList(listBelumSelesai);
					status = "Belum Selesai";
					break;
			}
		}

		function fillterByColor(target) {
			if (status == "Semua" && target.value == "Berdasarkan Warna") tampilkanSemuaList(semuaList);
			else if (status == "Selesai") {
				let semuaListFilter;
				const filterList = (statusList, warnaList) => semuaList.filter((list) => list.status == statusList && list.warna == warnaList);
				if (target.value == "Kuning") semuaListFilter = filterList("completed", "#ffffa9");
				if (target.value == "Hijau") semuaListFilter = filterList("completed", "#b4ffb4");
				if (target.value == "Biru") semuaListFilter = filterList("completed", "#a3ceff");
				if (target.value == "Hitam") semuaListFilter = filterList("completed", "#6d6d6d");
				if (target.value == "Abu - abu") semuaListFilter = filterList("completed", "#d3d3d3");
				if (target.value == "Putih") semuaListFilter = filterList("completed", "#ffffff");
				tampilkanSemuaList(semuaListFilter);
			} else if (status == "Belum Selesai") {
				let semuaListFilter;
				const filterList = (statusList, warnaList) => semuaList.filter((list) => list.status == statusList && list.warna == warnaList);
				if (target.value == "Kuning") semuaListFilter = filterList("uncompleted", "#ffffa9");
				if (target.value == "Hijau") semuaListFilter = filterList("uncompleted", "#b4ffb4");
				if (target.value == "Biru") semuaListFilter = filterList("uncompleted", "#a3ceff");
				if (target.value == "Hitam") semuaListFilter = filterList("uncompleted", "#6d6d6d");
				if (target.value == "Abu - abu") semuaListFilter = filterList("uncompleted", "#d3d3d3");
				if (target.value == "Putih") semuaListFilter = filterList("uncompleted", "#ffffff");
				tampilkanSemuaList(semuaListFilter);
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
			semuaList.push(new List(isiList, warna, status)); // Isi kembali array semuaList
			tampilkanSemuaList(semuaList);
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
