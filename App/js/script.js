function toDoListApp() {

    // Variabel
    const create = document.querySelector('.create');
    const input = document.querySelector('.input input');
    const btnShowInput = document.querySelector('.left button');
    const closeIcon = document.querySelector('.create header p');
    const btnCreateList = document.querySelector('#create');
    const listColor = document.querySelectorAll('.color span');
    let colorName = 'white';

    // Listener
    btnShowInput.addEventListener('click', () => showInputAlert(create, input));
    input.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            createList(input);
            closeList(create, input);
        };
    });
    btnCreateList.addEventListener('click', () => {
        createList(input);
        closeList(create, input);
    });
    closeIcon.addEventListener('click', () => closeList(create, input));
    listColor.forEach(color => color.addEventListener('click', function() {
        changeListColor(color);
    }))
    document.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('list')) target.classList.toggle('completed');
        if (target.classList.contains('fa-trash')) removeList(target);
        if (target.id == 'kategori1') fillterCompletedUncompleted(e);
        if (target.id == 'kategori2') fillterByColor(e);
    })

    // Function
    const showInputAlert = (e, i) => {
        e.classList.toggle('active');
        setTimeout(() => i.focus(), 15);
    };

    function closeList(create, input) {
        create.classList.remove('active');
        input.value = '';
    };

    function createList(inputValue) {
        if (inputValue.value === "") return;
        else {
            const listContainer = document.querySelector('.list-container');
            const div = document.createElement('div');
            div.classList.add('list', colorName);
            div.style.backgroundColor = input.style.backgroundColor;
            div.innerHTML = list(inputValue.value);
            listContainer.appendChild(div);
        }
    };

    function removeList(target) {
        let list = target.parentElement.parentElement;
        list.classList.add('remove');
        list.addEventListener('transitionend', () => list.remove());
    }

    function list(e) {
        return `<p>${e}</p>
                    <span>
                        <i class="fas fa-pen"></i>
                        <i class="fas fa-trash"></i>
                    </span>`
    };

    function fillterCompletedUncompleted(e) {
        const lists = document.querySelectorAll('.list');

        lists.forEach(list => {
            switch (e.target.value) {
                case "Semua":
                    list.style.display = 'flex';
                    break;
                case "Selesai":
                    list.classList.contains('completed') ? list.style.display = 'flex' : list.style.display = 'none';
                    break;
                case "Belum Selesai":
                    !list.classList.contains('completed') ? list.style.display = 'flex' : list.style.display = 'none';
                    break;
            }
        });
    };

    function fillterByColor(e) {
        const lists = document.querySelectorAll('.list');

        function cekClass(list, className) {
            list.classList.contains(className) ? list.style.display = 'flex' : list.style.display = 'none';
        }

        lists.forEach(list => {
            switch (e.target.value) {
                case "Berdasarkan Warna":
                    list.style.display = 'flex';
                    break;
                case "Kuning":
                    cekClass(list, 'yellow');
                    break;
                case "Hijau":
                    cekClass(list, 'green');
                    break;
                case "Biru":
                    cekClass(list, 'blue');
                    break;
                case "Hitam":
                    cekClass(list, 'black');
                    break;
                case "Abu - abu":
                    cekClass(list, 'grey');
                    break;
                case "Putih":
                    cekClass(list, 'white');
                    break;
            };
        });
    }

    function changeListColor(color) {
        const colorId = color.id;
        switch (colorId) {
            case "yellow":
                input.style.backgroundColor = '#ffffa9';
                colorName = 'yellow';
                input.focus();
                break;
            case "green":
                input.style.backgroundColor = '#b4ffb4';
                colorName = 'green';
                input.focus();
                break;
            case "blue":
                input.style.backgroundColor = '#a3ceff';
                colorName = 'blue';
                input.focus();
                break;
            case "black":
                input.style.backgroundColor = '#6d6d6d';
                colorName = 'black';
                input.focus();
                break;
            case "grey":
                input.style.backgroundColor = '#d3d3d3';
                colorName = 'grey';
                input.focus();
                break;
            case "white":
                input.style.backgroundColor = '#ffffff';
                colorName = 'white';
                input.focus();
                break;
        };
        for (let i = 0; i < listColor.length; i++) listColor[i].classList.remove('active');
        color.classList.add('active');
    }
};
toDoListApp();